using System.Diagnostics;

namespace OOPLab2.Class
{
    public abstract class Techinc
    {
        protected string name;
        protected int id;
        protected string country;
        protected bool enabled;

        public string getName() { return name; }
        public int getId() { return id; }
        public string getCountry() { return country; }
        public bool isEnabled() { return enabled; }

        public void setName(string name) { this.name = name; }
        public void setID(int id) { this.id = id; }
        public void setCountry(string country) { this.country = country; }
        public void setEnabled(bool enabled) { this.enabled = enabled; }

        public Techinc()
        {
            this.name = "kek";
            this.id = 0;
            this.country = "China";
            this.enabled = false;
        }

        public Techinc(string name, int id)
        {
            this.name = name;
            this.id = id;
            this.country = "China";
            this.enabled = false;
        }
        public Techinc(string name, int id, string country, bool enable)
        {
            this.name = name;
            this.id = id;
            this.country = country;
            this.enabled = enable;
        }

        public virtual void displayInfo()
        {
            Console.WriteLine($"Устройство : ", name);
            Console.WriteLine($"ID: ", id);
            Console.WriteLine($"Страна производитель: ", country);
            Console.WriteLine($"Состояние: ", enabled == true ? "включен" : "Выключен");
        }
        public virtual double calculatePowerConsumption() => 0;
    }
}
