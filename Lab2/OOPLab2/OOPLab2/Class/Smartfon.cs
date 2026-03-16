namespace OOPLab2.Class
{
    public class Smartfon : Techinc
    {
        private int cameraMP;
        private bool isCall = false;
        private string manufactures;

        public Smartfon() : base()
        {
            this.cameraMP = 1;
            this.isCall = false;
            this.manufactures = "Huawei";
        }
        public Smartfon(string name, int id, int cameraMP) : base(name, id)
        {
            this.cameraMP = cameraMP;
            this.isCall = false;
            this.manufactures = "Huawei";
        }
        public Smartfon(string name, int id, string country, bool enabled, int cameraMP, bool isCall, string manufactures) 
            : base(name, id, country, enabled)
        {
            this.cameraMP = cameraMP;
            this.isCall = isCall;
            this.manufactures = manufactures;
        }
        public int getCameraMP() { return cameraMP; }
        public string getManufactures() { return manufactures; }
        public bool getIsCall() { return isCall; }

        public void setCameraMP(int cameraMP) { this.cameraMP = cameraMP; }
        public void setManufactures(string manufactures) { this.manufactures = manufactures; }
        public void call() { this.isCall = true; }
        public void reset() { this.isCall = false; }
        public void takePhoto()
        {
            Console.WriteLine($"Сделано фото качеством - ", cameraMP, " мегапикселей");
        }
        public override void displayInfo()
        {
            base.displayInfo();
            Console.WriteLine($"Производитель телефона: ", manufactures);
            Console.WriteLine($"Мегапиксели телефона: ", cameraMP);
        }
        public override double calculatePowerConsumption()
        {
            return enabled ? 5 : 0.5;
        }
    }
}
