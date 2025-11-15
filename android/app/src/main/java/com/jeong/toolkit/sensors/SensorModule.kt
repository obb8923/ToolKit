package com.jeong.toolkit.sensors

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

abstract class SensorModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    protected val sensorManager: SensorManager by lazy {
        reactApplicationContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    }
    
    protected var isListening = false
    
    abstract fun startListening()
    
    abstract fun stopListening()
    
    override fun onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy()
        stopListening()
    }
}

