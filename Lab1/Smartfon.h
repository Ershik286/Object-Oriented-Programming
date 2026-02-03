#pragma once
#include <iostream>
#include "Technic.h"

using namespace std;

class Smartfon :
    public Technic
{
private:
    int cameraMP;
    bool isCall = false;
    string manufactures;
public:
    Smartfon(int cameraMP, string manufactures, int id, string country, string name) {
        this->cameraMP = cameraMP;
        this->manufactures = manufactures;
        this->country = country;
        this->id = id;
        this->name = name;
    }

    Smartfon(string manufactures, int id, string country, string name) {
        this->manufactures = manufactures;
        this->country = country;
        this->id = id;
        this->name = name;

        this->cameraMP = 0;
    }

    ~Smartfon() = default;

    const string phoneManufacturers[3] = {"Samsung", "Apple", "Honor"};
    void call() {
        this->isCall = true;
        cout << "Телефон звонит" << endl;
    }

    bool getIsCall() { return isCall; }
    int getCameraMP() { return cameraMP; }
    string getManufactures(){ return manufactures; }

    void takePhoto() {
        cout << "Сделано фото качеством - " << cameraMP << "мегапикселей" << endl;
    }

    void displayInfo() override {
        cout << "Устройство: " << name << endl;
        cout << "ID: " << id << endl;
        cout << "Страна производитель: " << country << endl;
        cout << "Производитель телефона: " << manufactures << endl;
        cout << "Мегапиксели камеры - " << cameraMP << endl;
        cout << "Состояние: " << (enable ? "Включен" : "Выключен") << endl;
    }

    double calculatePowerConsumption() const override {
        if (!enable) return 0.5;
        return 5.0;
    }
};

