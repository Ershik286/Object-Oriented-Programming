#include <iostream>
#include "Computer.h"
#include "Technic.h"
#include "Smartfon.h"
using namespace std;

int main()
{
    Technic* telefon = new Smartfon(30, "Samsung", 1 ,"Китай", "Galaxy A26");
    Technic* comp = new Computer(16, "AMD", 2, "США", "My Computer");
    Technic* masssive[3] = { telefon, comp, new Smartfon("Samsung", 1 ,"Китай", "Galaxy A26") };

    Smartfon* smartfonPtr = dynamic_cast<Smartfon*>(masssive[0]);

    smartfonPtr->takePhoto();
}