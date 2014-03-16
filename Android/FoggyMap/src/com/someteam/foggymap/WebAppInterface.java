package com.someteam.foggymap;

import android.content.Context;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebAppInterface {
    Context mContext;
    String receivedData;

    /** Instantiate the interface and set the context */
    WebAppInterface(Context c) {
        mContext = c;
        receivedData = "";
    }

    /** Show a toast from the web page */
    private void showToast(String toast) {
		Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
    }
    
    /** Java code receives data from JS */
    @JavascriptInterface
    public void receiveData(String data) {
		receivedData = data;
		showToast(receivedData);
    }
}
