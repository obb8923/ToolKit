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

class BarometerModule(reactContext: ReactApplicationContext) : SensorModule(reactContext), SensorEventListener {
    private var sensor: Sensor? = null
    private val eventName = "BarometerData"
    
    init {
        sensor = sensorManager.getDefaultSensor(Sensor.TYPE_PRESSURE)
    }
    
    override fun getName(): String = "BarometerModule"
    
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
        if (event?.sensor?.type == Sensor.TYPE_PRESSURE) {
            val pressure = event.values[0] // hPa
            
            val params: WritableMap = Arguments.createMap()
            params.putDouble("pressure", pressure.toDouble())
            
            sendEvent(eventName, params)
        }
    }
    
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not needed for pressure sensor
    }
    
    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}

