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

class ProximityModule(reactContext: ReactApplicationContext) : SensorModule(reactContext), SensorEventListener {
    private var sensor: Sensor? = null
    private val eventName = "ProximityData"
    
    init {
        sensor = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY)
    }
    
    override fun getName(): String = "ProximityModule"
    
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
        if (event?.sensor?.type == Sensor.TYPE_PROXIMITY) {
            val distance = event.values[0]
            
            // 거리 값만 전송 (cm 단위)
            // 이진 센서의 경우: Near = 0 또는 작은 값, Far = maxRange (예: 5cm)
            val params: WritableMap = Arguments.createMap()
            params.putDouble("distance", distance.toDouble())
            
            sendEvent(eventName, params)
        }
    }
    
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Not needed for proximity sensor
    }
    
    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}

