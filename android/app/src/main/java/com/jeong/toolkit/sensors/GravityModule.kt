package com.jeong.toolkit.sensors

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlin.math.sqrt

class GravityModule(reactContext: ReactApplicationContext) : SensorModule(reactContext), SensorEventListener {
    private var sensor: Sensor? = null
    private val eventName = "GravityData"
    
    init {
        // Try TYPE_GRAVITY first, fallback to TYPE_ACCELEROMETER if not available
        sensor = sensorManager.getDefaultSensor(Sensor.TYPE_GRAVITY)
            ?: sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    }
    
    override fun getName(): String = "GravityModule"
    
    @ReactMethod
    override fun startListening() {
        if (isListening || sensor == null) return
        
        sensorManager.registerListener(
            this,
            sensor,
            SensorManager.SENSOR_DELAY_UI
        )
        isListening = true
    }
    
    @ReactMethod
    override fun stopListening() {
        if (!isListening) return
        
        sensorManager.unregisterListener(this)
        isListening = false
    }
    
    override fun onSensorChanged(event: SensorEvent?) {
        val sensorType = event?.sensor?.type
        if (sensorType == Sensor.TYPE_GRAVITY || sensorType == Sensor.TYPE_ACCELEROMETER) {
            val x = event.values[0]
            val y = event.values[1]
            val z = event.values[2]
            
            // Calculate magnitude: sqrt(x² + y² + z²)
            val magnitude = sqrt((x * x + y * y + z * z).toDouble())
            
            val params: WritableMap = Arguments.createMap()
            params.putDouble("x", x.toDouble())
            params.putDouble("y", y.toDouble())
            params.putDouble("z", z.toDouble())
            params.putDouble("magnitude", magnitude)
            
            sendEvent(eventName, params)
        }
    }
    
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not needed for gravity sensor
    }
    
    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}

