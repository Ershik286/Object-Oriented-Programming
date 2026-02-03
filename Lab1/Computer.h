#pragma once
#include "Technic.h"
#include <conio.h> 
class Computer :
    public Technic
{
private:
    string modelProcessor;
    int RAM;

    bool progat = false;
    bool igrat = false;
public:
    Computer(int RAM, string modelProcessor, int id, string country, string name) {
        this->RAM = RAM;
        this->modelProcessor = modelProcessor;
        this->country = country;
        this->id = id;
        this->name = name;
    }

    ~Computer() = default;

    bool getProgat() { return progat; }
    bool getIgrat() { return igrat; }

    void gaming() {
        this->igrat = true;
    }

    void closeGame() {
        this->igrat = false;
    }

    void programming() {
        this->progat = true;
    }

    void endProgramming() {
        this->progat = false;
    }

    void enableDevice() {
        this->enable = true;
        cout << "Если хотите поиграть - нажмите 1, если хотите программировать нажмите 2" << endl;
        int get = 0;
        if (get == 1) {
            gaming();
        }
        if (get == 2) {
            programming();
        }
    }

    void displayInfo() override {
        cout << "Устройство: " << name << endl;
        cout << "ID: " << id << endl;
        cout << "Страна производитель: " << country << endl;
        cout << "Модель процессора: " << modelProcessor << endl;
        cout << "Объем оперативной памяти - " << RAM << endl;
        cout << "Состояние: " << (enable ? "Включен" : "Выключен") << endl;
    }

    double calculatePowerConsumption() const override {
        if (!enable) return 10.0;
        return 300.0;
    }
};

