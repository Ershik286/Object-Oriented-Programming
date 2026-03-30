using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOP_lab2.Class {
    public class Computer : Technic {
        public string ModelProcessor { get; set; }
        public int Ram { get; set; }

        public Computer() : base() {
            ModelProcessor = "intel";
            Ram = 4;
            //TechnicId = 0; //SQL запрос для определения id
        }

        public Computer(string modelProcessor, int ram, string name, int id) : base(name, id) {
            ModelProcessor = modelProcessor;
            Ram = ram;
        }

        public Computer(string modelProcessor, int ram, string name, int id, string country, bool enable)
            : base(name, id, country, enable) {
            ModelProcessor = modelProcessor;
            Ram = ram;
        }

        public void enabledDevice() {
            Enabled = true;
        }

        public override void displayInfo() {
            base.displayInfo();
            Console.WriteLine($"Модель процессора: {ModelProcessor}");
            Console.WriteLine($"Объем ОЗУ: {Ram}");
        }

        public override double calculatePowerConsumption() {
            return Enabled ? 200 : 10;
        }
    }
}