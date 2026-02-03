#pragma once
#include <iostream>
using namespace std;
class Technic
{
public:
	string name;
	int id;
	string country;
	bool enable = false;

	string getName() {
		return name;
	}

	int getID() {
		return id;
	}

	string getCountry() {
		return country;
	}

	bool checkStatus() {
		return enable;
	}

	void setName(string name) { this->name = name; }
	void setCountry(string country) { this->country = country; }
	void setId(int id) { this->id = id; }

	void enableDevice() {
		this->enable = true;
	}

	void disableDevice() {
		this->enable = false;
	}

	Technic() {

	}

	Technic(string name, int id, string country)
		: name(name), id(id), country(country), enable(false) {}

	virtual ~Technic() = default;

	virtual void displayInfo() {
		cout << "Устройство: " << name << endl;
		cout << "ID: " << id << endl;
		cout << "Страна производитель: " << country << endl;
		cout << "Состояние: " << (enable ? "Включен" : "Выключен") << endl;
	}

	virtual double calculatePowerConsumption() const = 0;
};

