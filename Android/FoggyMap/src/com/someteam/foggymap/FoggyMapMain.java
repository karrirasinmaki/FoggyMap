package com.someteam.foggymap;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import com.someteam.foggymap.R;

public class FoggyMapMain extends Activity implements OnClickListener {
	private static final String TAG = "Foggy Map";
	Button buttonStart, buttonStop;
	private WebView mWebView;
	private boolean serviceStarted = false;

	// TODO: can be made without buttons
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);

		mWebView = (WebView) findViewById(R.id.webview);
		mWebView.getSettings().setJavaScriptEnabled(true);
		mWebView.loadUrl("http://karrirasinmaki.tk/FoggyMap/");
		mWebView.setWebViewClient(new HelloWebViewClient());
		mWebView.getSettings().setDomStorageEnabled(true);

		mWebView.setWebChromeClient(new WebChromeClient() {
			public void onGeolocationPermissionsShowPrompt(String origin,
					android.webkit.GeolocationPermissions.Callback callback) {
				callback.invoke(origin, true, false);
			}
		});
		mWebView.addJavascriptInterface(new WebAppInterface(this), "WrapperApp");

		// mWebView.loadUrl("javascript:receiveData('some data')");

		buttonStart = (Button) findViewById(R.id.buttonStart);
		buttonStop = (Button) findViewById(R.id.buttonStop);

		buttonStart.setOnClickListener(this);
		buttonStop.setOnClickListener(this);
	}

	private class HelloWebViewClient extends WebViewClient {
		@Override
		public boolean shouldOverrideUrlLoading(WebView webview, String url) {
			webview.loadUrl(url);
			return true;
		}
	}

	// TODO: can be made without buttons
	public void onClick(View src) {
		String dataToSend;
		switch (src.getId()) {
		case R.id.buttonStart:
			Log.d(TAG, "onClick: starting service");
			if (!serviceStarted) {
				startService(new Intent(this, MyService.class));
				serviceStarted = true;
			} else {
				dataToSend = MyService.getVisitedLocations();
				mWebView.loadUrl("javascript:receiveData('" + dataToSend + "')");
			}
			break;
		case R.id.buttonStop:
			Log.d(TAG, "onClick: stopping srvice");
			dataToSend = MyService.getVisitedLocations();
			mWebView.loadUrl("javascript:receiveData('" + dataToSend + "')");
			stopService(new Intent(this, MyService.class));
			serviceStarted = false;
			break;
		}
	}
}