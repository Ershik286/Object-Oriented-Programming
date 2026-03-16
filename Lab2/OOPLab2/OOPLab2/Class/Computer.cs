namespace OOPLab2.Class
{
    public class Computer : Techinc
    {
        private string modelProcessor;
        int ram;
        bool progat = false;
        bool igrat = false;

        public Computer() : base()
        {
            this.modelProcessor = "intel";
            this.ram = 4;
        }

        public Computer(string modelProcessor, int ram, string name, int id) : base(name, id)
        {
            this.modelProcessor = modelProcessor;
            this.ram = ram;
        }

        public Computer(string modelProcessor, int ram, string name, int id, string country, bool enable) 
            : base(name, id, country, enable)
        {
            this.modelProcessor = modelProcessor;
            this.ram = ram;
        }

        public void enabledDevice()
        {
            this.enabled = true;
            this.progat = true;
            this.igrat = true;
        }
    }
}
