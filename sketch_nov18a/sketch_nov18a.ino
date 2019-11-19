#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include "DHTesp.h"
#define FIREBASE_HOST "newagent-rrgqwd.firebaseio.com" //Thay bằng địa chỉ firebase của bạn
#define FIREBASE_AUTH ""   //Không dùng xác thực nên không đổi
#define WIFI_SSID "RushB"   //Thay wifi và mật khẩu
#define WIFI_PASSWORD "11001100"
DHTesp dht;
int rainSensor = D4;
void setup() {
  Serial.begin(115200);
  dht.setup(12, DHTesp::DHT11);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
}
void loop() {
  float temp = dht.getTemperature();
  float humi = dht.getHumidity();
  int value = digitalRead(rainSensor);
  Firebase.setFloat("data/HumiStatus", humi);
  Firebase.setFloat("data/TempStatus", temp);
  Firebase.setInt("data/RainStatus", value);
  delay(1000);
}
