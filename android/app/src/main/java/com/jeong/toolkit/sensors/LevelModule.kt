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
import kotlin.math.atan2
import kotlin.math.sqrt

class LevelModule(reactContext: ReactApplicationContext) : SensorModule(reactContext), SensorEventListener {
    private var sensor: Sensor? = null
    private val eventName = "LevelData"
    
    init {
        sensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    }
    
    override fun getName(): String = "LevelModule"
    
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
        if (event?.sensor?.type == Sensor.TYPE_ACCELEROMETER) {
            val x = event.values[0]
            val y = event.values[1]
            val z = event.values[2]
            
            // Calculate tilt angles in degrees
            val pitch = Math.toDegrees(atan2(x.toDouble(), sqrt((y * y + z * z).toDouble())))
            val roll = Math.toDegrees(atan2(y.toDouble(), sqrt((x * x + z * z).toDouble())))
            
            val params: WritableMap = Arguments.createMap()
            params.putDouble("x", x.toDouble())
            params.putDouble("y", y.toDouble())
            params.putDouble("z", z.toDouble())
            params.putDouble("pitch", pitch)
            params.putDouble("roll", roll)
            
            sendEvent(eventName, params)
        }
    }
    
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not needed for accelerometer
    }
    
    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}

