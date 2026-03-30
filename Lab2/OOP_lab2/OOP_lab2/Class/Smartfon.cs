using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OOP_lab2.Class {
    public class Smartfon : Technic {
        public int CameraMP { get; set; }
        public bool IsCall { get; set; } = false;
        public string Manufactures { get; set; }

        public Smartfon() : base() {
            CameraMP = 1;
            IsCall = false;
            Manufactures = "Huawei";
        }

        public Smartfon(string name, int id, int cameraMP) : base(name, id) {
            CameraMP = cameraMP;
            IsCall = false;
            Manufactures = "Huawei";
        }

        public Smartfon(string name, int id, string country, bool enabled, int cameraMP, bool isCall, string manufactures)
            : base(name, id, country, enabled) {
            CameraMP = cameraMP;
            IsCall = isCall;
            Manufactures = manufactures;
        }

        public int getCameraMP() { return CameraMP; }
        public string getManufactures() { return Manufactures; }
        public bool getIsCall() { return IsCall; }

        public void setCameraMP(int cameraMP) { CameraMP = cameraMP; }
        public void setManufactures(string manufactures) { Manufactures = manufactures; }
        public void call() { IsCall = true; }
        public void reset() { IsCall = false; }

        public void takePhoto() {
            Console.WriteLine($"Сделано фото качеством {CameraMP} мегапикселей");
        }

        public override void displayInfo() {
            base.displayInfo();
            Console.WriteLine($"Производитель телефона: {Manufactures}");
            Console.WriteLine($"Мегапиксели телефона: {CameraMP}");
        }

        public override double calculatePowerConsumption() {
            return Enabled ? 5 : 0.5;
        }
    }
}