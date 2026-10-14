package com.smartstudytv

import android.view.KeyEvent
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.bridge.Arguments
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "SmartStudyTV"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  /**
   * Forward hardware D-pad and TV remote key events to React Native JS
   */
  override fun dispatchKeyEvent(event: KeyEvent): Boolean {
    val eventType = when (event.keyCode) {
      KeyEvent.KEYCODE_DPAD_UP -> "up"
      KeyEvent.KEYCODE_DPAD_DOWN -> "down"
      KeyEvent.KEYCODE_DPAD_LEFT -> "left"
      KeyEvent.KEYCODE_DPAD_RIGHT -> "right"
      KeyEvent.KEYCODE_DPAD_CENTER,
      KeyEvent.KEYCODE_ENTER,
      KeyEvent.KEYCODE_NUMPAD_ENTER,
      KeyEvent.KEYCODE_BUTTON_A -> "select"
      KeyEvent.KEYCODE_BACK,
      KeyEvent.KEYCODE_ESCAPE,
      KeyEvent.KEYCODE_BUTTON_B -> "back"
      KeyEvent.KEYCODE_MEDIA_PLAY_PAUSE,
      KeyEvent.KEYCODE_MEDIA_PLAY -> "playPause"
      else -> null
    }

    if (eventType != null) {
      if (event.action == KeyEvent.ACTION_DOWN && event.repeatCount == 0) {
        try {
          val params = Arguments.createMap().apply {
            putString("eventType", eventType)
            putInt("keyCode", event.keyCode)
          }
          reactInstanceManager?.currentReactContext?.let { reactContext ->
            if (reactContext.hasActiveReactInstance()) {
              reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("onHWKeyEvent", params)
            }
          }
        } catch (e: Exception) {
          // React context might be reloading
        }
      }
      return true
    }
    return super.dispatchKeyEvent(event)
  }
}
