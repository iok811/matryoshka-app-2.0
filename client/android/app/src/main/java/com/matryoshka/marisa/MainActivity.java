package com.matryoshka.marisa;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;

// La WebView di Android blocca l'accesso al microfono per il contenuto web (usato dal
// controllo di pronuncia) anche col permesso RECORD_AUDIO dichiarato nel manifest — serve
// gestire esplicitamente la richiesta di permesso della WebView stessa, altrimenti il
// riconoscimento vocale fallisce in silenzio senza mai mostrare un errore chiaro.
public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    this.bridge.getWebView().setWebChromeClient(new WebChromeClient() {
      @Override
      public void onPermissionRequest(final PermissionRequest request) {
        runOnUiThread(() -> {
          if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.RECORD_AUDIO)
              != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.RECORD_AUDIO}, 1001);
          }
          request.grant(request.getResources());
        });
      }
    });
  }
}
