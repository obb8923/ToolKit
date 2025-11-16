package com.jeong.toolkit.sensors

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class SensorPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(
            BarometerModule(reactContext),
            LevelModule(reactContext),
            LightMeterModule(reactContext),
            CompassModule(reactContext),
            SoundMeterModule(reactContext),
            ProximityModule(reactContext),
            GravityModule(reactContext)
        )
    }
    
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}

