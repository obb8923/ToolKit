package com.jeong.toolkit.sensors

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioFormat
import android.media.AudioRecord
import android.media.MediaRecorder
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.jeong.toolkit.BuildConfig
import kotlin.math.abs
import kotlin.math.log10
import kotlin.math.max

class SoundMeterModule(reactContext: ReactApplicationContext) : SensorModule(reactContext) {
    private val eventName = "SoundMeterData"
    private var audioRecord: AudioRecord? = null
    private var recordingThread: Thread? = null
    private val sampleRate = 44100
    private val channelConfig = AudioFormat.CHANNEL_IN_MONO
    private val audioFormat = AudioFormat.ENCODING_PCM_16BIT
    private val bufferSize = AudioRecord.getMinBufferSize(sampleRate, channelConfig, audioFormat)
    
    override fun getName(): String = "SoundMeterModule"
    
    @ReactMethod
    fun checkPermission(promise: Promise) {
        val hasPermission = ContextCompat.checkSelfPermission(
            reactApplicationContext,
            Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
        promise.resolve(hasPermission)
    }
    
    @ReactMethod
    override fun startListening() {
        if (isListening) return
        
        // Check permission
        val hasPermission = ContextCompat.checkSelfPermission(
            reactApplicationContext,
            Manifest.permission.RECORD_AUDIO
        ) == PackageManager.PERMISSION_GRANTED
        
        if (!hasPermission) {
            android.util.Log.e("SoundMeterModule", "RECORD_AUDIO permission not granted")
            return
        }
        
        // Check buffer size
        if (bufferSize == AudioRecord.ERROR_BAD_VALUE || bufferSize == AudioRecord.ERROR) {
            android.util.Log.e("SoundMeterModule", "Invalid buffer size: $bufferSize")
            return
        }
        
        try {
            audioRecord = AudioRecord(
                MediaRecorder.AudioSource.MIC,
                sampleRate,
                channelConfig,
                audioFormat,
                bufferSize * 2 // Use double buffer size for stability
            )
            
            if (audioRecord?.state != AudioRecord.STATE_INITIALIZED) {
                android.util.Log.e("SoundMeterModule", "AudioRecord initialization failed. State: ${audioRecord?.state}")
                audioRecord?.release()
                audioRecord = null
                return
            }
            
            audioRecord?.startRecording()
            isListening = true
            
            android.util.Log.d("SoundMeterModule", "Started recording")
            
            recordingThread = Thread {
                val buffer = ShortArray(bufferSize)
                var sampleCount = 0
                
                while (isListening && audioRecord != null) {
                    try {
                        val read = audioRecord?.read(buffer, 0, bufferSize) ?: 0
                        
                        if (read > 0) {
                            val amplitude = calculateAmplitude(buffer, read)
                            val decibels = calculateDecibels(amplitude)
                            
                            // 샘플링 빈도 조절 (매 10번째 샘플마다 전송)
                            sampleCount++
                            if (sampleCount >= 10) {
                                sampleCount = 0
                                
                                val params: WritableMap = Arguments.createMap()
                                params.putDouble("decibels", decibels)
                                params.putDouble("amplitude", amplitude)
                                
                                if (BuildConfig.DEBUG) {
                                    android.util.Log.d("SoundMeterModule", "Sending event: decibels=$decibels, amplitude=$amplitude")
                                }
                                
                                sendEvent(eventName, params)
                            }
                        } else if (read < 0) {
                            android.util.Log.e("SoundMeterModule", "AudioRecord read error: $read")
                            break
                        }
                    } catch (e: Exception) {
                        android.util.Log.e("SoundMeterModule", "Error reading audio", e)
                        break
                    }
                }
                
                android.util.Log.d("SoundMeterModule", "Recording thread stopped")
            }
            
            recordingThread?.start()
        } catch (e: Exception) {
            android.util.Log.e("SoundMeterModule", "Error starting recording", e)
            e.printStackTrace()
        }
    }
    
    @ReactMethod
    override fun stopListening() {
        if (!isListening) return
        
        isListening = false
        
        try {
            audioRecord?.stop()
            audioRecord?.release()
            audioRecord = null
            
            recordingThread?.join(1000)
            recordingThread = null
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    
    private fun calculateAmplitude(buffer: ShortArray, readSize: Int): Double {
        var sum = 0.0
        for (i in 0 until readSize) {
            sum += abs(buffer[i].toDouble())
        }
        return sum / readSize
    }
    
    private fun calculateDecibels(amplitude: Double): Double {
        if (amplitude == 0.0) return 0.0
        
        // Reference amplitude for 0 dB (typically 32767 for 16-bit audio)
        val referenceAmplitude = 32767.0
        val ratio = amplitude / referenceAmplitude
        
        // Calculate dB: 20 * log10(ratio)
        val decibels = 20 * log10(max(ratio, 0.0001))
        
        // Normalize to typical range (0-120 dB)
        return max(0.0, decibels + 60) // Adjust offset as needed
    }
    
    private fun sendEvent(eventName: String, params: WritableMap) {
        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
            if (BuildConfig.DEBUG) {
                android.util.Log.d("SoundMeterModule", "Event sent: $eventName, decibels: ${params.getDouble("decibels")}")
            }
        } catch (e: Exception) {
            android.util.Log.e("SoundMeterModule", "Error sending event", e)
        }
    }
}

