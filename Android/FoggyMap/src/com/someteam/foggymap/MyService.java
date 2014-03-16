package com.someteam.foggymap;

import java.util.LinkedList;
import java.util.List;

import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
//import android.media.MediaPlayer;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

public class MyService extends Service {
	private static final String TAG = "MyService";

	// MediaPlayer player; // TODO: remove

	private static final int TWO_MINUTES = 1000 * 60 * 2;

	private static List<Location> visitedLocations = new LinkedList<Location>();
	private Location currentBestLocation;
	private LocationManager locationManager;
	private LocationListener locationListener;

	private void makeUseOfNewLocation(Location location) {
		if (currentBestLocation == null) {
			currentBestLocation = location;
		} else if (isSamePosition(location, currentBestLocation)) {
			return;
		} else if (isBetterLocation(location, currentBestLocation)) {
			currentBestLocation = location;
			visitedLocations.add(location);

			Log.v("new location added: ", "[" + location.getLatitude() + ", "
					+ location.getLongitude() + "]");
		}
	}

	//TODO: comparing double (beware of stupid precision errors!)
	private boolean isSamePosition(Location location1, Location location2) {
		if (location1.getLatitude() == location2.getLatitude()) {
			if (location1.getLongitude() == location2.getLongitude()) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Determines whether one Location reading is better than the current
	 * Location fix
	 * 
	 * @param location
	 *            The new Location that you want to evaluate
	 * @param currentBestLocation
	 *            The current Location fix, to which you want to compare the new
	 *            one
	 */
	protected boolean isBetterLocation(Location location,
			Location currentBestLocation) {
		if (currentBestLocation == null) {
			// A new location is always better than no location
			return true;
		}

		// Check whether the new location fix is newer or older
		long timeDelta = location.getTime() - currentBestLocation.getTime();
		boolean isSignificantlyNewer = timeDelta > TWO_MINUTES;
		boolean isSignificantlyOlder = timeDelta < -TWO_MINUTES;
		boolean isNewer = timeDelta > 0;

		// If it's been more than two minutes since the current location, use
		// the new location
		// because the user has likely moved
		if (isSignificantlyNewer) {
			return true;
			// If the new location is more than two minutes older, it must be
			// worse
		} else if (isSignificantlyOlder) {
			return false;
		}

		// Check whether the new location fix is more or less accurate
		int accuracyDelta = (int) (location.getAccuracy() - currentBestLocation
				.getAccuracy());
		boolean isLessAccurate = accuracyDelta > 0;
		boolean isMoreAccurate = accuracyDelta < 0;
		boolean isSignificantlyLessAccurate = accuracyDelta > 200;

		// Check if the old and new location are from the same provider
		boolean isFromSameProvider = isSameProvider(location.getProvider(),
				currentBestLocation.getProvider());

		// Determine location quality using a combination of timeliness and
		// accuracy
		if (isMoreAccurate) {
			return true;
		} else if (isNewer && !isLessAccurate) {
			return true;
		} else if (isNewer && !isSignificantlyLessAccurate
				&& isFromSameProvider) {
			return true;
		}
		return false;
	}

	/** Checks whether two providers are the same */
	private boolean isSameProvider(String provider1, String provider2) {
		if (provider1 == null) {
			return provider2 == null;
		}
		return provider1.equals(provider2);
	}

	public static String getVisitedLocations() {

		// if(visitedLocations == null) {
		// return "[]";
		// }
		StringBuilder result = new StringBuilder();
		result.append('[');
		for (Location location : visitedLocations) {
			result.append('[');
			result.append(location.getLatitude());
			result.append(',');
			result.append(location.getLongitude());
			result.append(']');
			result.append(',');
		}
		if (visitedLocations.size() > 0) {
			result.setCharAt(result.length() - 1, ']');
		} else {
			result.append(']');
		}

		visitedLocations.clear(); // once the locations are returned, they are
									// not useful anymore
		return result.toString();
	}

	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	@Override
	public void onCreate() {
		// Toast.makeText(this, TAG + " created", Toast.LENGTH_LONG).show();
		// Log.d(TAG, "onCreate");

		// TODO: put GPS (and file) creation here, but don't start

		// player = MediaPlayer.create(this, R.raw.braincandy);
		// player.setLooping(false); // Set looping

		// Acquire a reference to the system Location Manager
		locationManager = (LocationManager) this
				.getSystemService(Context.LOCATION_SERVICE);

		// Define a listener that responds to location updates
		locationListener = new LocationListener() {
			public void onLocationChanged(Location location) {
				// Called when a new location is found by the network location
				// provider.
				makeUseOfNewLocation(location);
			}

			public void onStatusChanged(String provider, int status,
					Bundle extras) {
			}

			public void onProviderEnabled(String provider) {
			}

			public void onProviderDisabled(String provider) {
			}
		};

	}

	@Override
	public void onDestroy() {
		// TODO: stop GPS data collection here
		Toast.makeText(this, TAG + " Stopped", Toast.LENGTH_LONG).show();
		Log.d(TAG, "onDestroy");

		// player.stop(); // TODO: remove

		locationManager.removeUpdates(locationListener);
	}

	@Override
	public void onStart(Intent intent, int startid) {
		// TODO: start GPS data collection here
		Toast.makeText(this, TAG + " Started", Toast.LENGTH_LONG).show();
		Log.d(TAG, "onStart");

		// player.start(); // TODO: remove

		// Register the listener with the Location Manager to receive location
		// updates
		locationManager.requestLocationUpdates(
				LocationManager.NETWORK_PROVIDER, 0, 0, locationListener);
	}
}
