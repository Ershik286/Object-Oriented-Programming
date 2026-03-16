using System.ComponentModel.DataAnnotations;
using System.Diagnostics;

namespace OOP_lab2.Class {
    public class Technic {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; }
        public string Country { get; set; }
        public bool Enabled { get; set; }
        public virtual Computer Computer { get; set; }
        public virtual Smartfon Smartfon { get; set; }
        public string getName() { return Name; }
        public int getId() { return Id; }
        public string getCountry() { return Country; }
        public bool isEnabled() { return Enabled; }

        public void setName(string name) { Name = name; }
        public void setID(int id) { Id = id; }
        public void setCountry(string country) { Country = country; }
        public void setEnabled(bool enabled) { Enabled = enabled; }

        public Technic() {
            Name = "kek";
            Id = 0;
            Country = "China";
            Enabled = false;
        }

        public Technic(string name, int id) {
            Name = name;
            Id = id;
            Country = "China";
            Enabled = false;
        }

        public Technic(string name, int id, string country, bool enable) {
            Name = name;
            Id = id;
            Country = country;
            Enabled = enable;
        }

        public virtual void displayInfo() {
            Console.WriteLine($"Устройство: {Name}");
            Console.WriteLine($"ID: {Id}");
            Console.WriteLine($"Страна производитель: {Country}");
            Console.WriteLine($"Состояние: {(Enabled ? "включен" : "Выключен")}");
        }

        public virtual double calculatePowerConsumption() => 0;
    }
}