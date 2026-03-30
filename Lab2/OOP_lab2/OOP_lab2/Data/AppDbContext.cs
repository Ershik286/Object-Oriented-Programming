using Microsoft.EntityFrameworkCore;
using OOP_lab2.Class;
using System.Collections;

public class AppDbContext : DbContext {
    public DbSet<Technic> Technics { get; set; }
    public DbSet<Computer> Computers { get; set; }
    public DbSet<Smartfon> Smartfons { get; set; }

    public const string connectionString = "Host=localhost;Port=5432;Database=Technics;Username=Ershik286;Password=CyberBiba227;Include Error Detail=true";

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {
    }

    public AppDbContext() {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        if (!optionsBuilder.IsConfigured) {
            optionsBuilder.UseNpgsql(connectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Настройка Technic
        modelBuilder.Entity<Technic>(entity => {
            entity.ToTable("Technics");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).UseIdentityAlwaysColumn();
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Country).IsRequired();
            entity.Property(e => e.Enabled);
        });

        // Настройка Computer для TPT
        modelBuilder.Entity<Computer>(entity => {
            entity.ToTable("Computers");
            // Указываем, что Computer наследует Technic через Id
            entity.HasBaseType<Technic>();

            entity.Property(e => e.ModelProcessor).IsRequired();
            entity.Property(e => e.Ram).IsRequired();
        });

        // Настройка Smartfon для TPT
        modelBuilder.Entity<Smartfon>(entity => {
            entity.ToTable("Smartfons");
            entity.HasBaseType<Technic>();

            entity.Property(e => e.CameraMP).IsRequired();
            entity.Property(e => e.Manufactures).IsRequired();
            entity.Property(e => e.IsCall);
        });
    }
}
public class TechnicService {
    private readonly AppDbContext _dbContext;
    public TechnicService(AppDbContext dbContext) {
        _dbContext = dbContext;
    }

    public void Update(Technic technic) {
        _dbContext.Technics.Update(technic);
        _dbContext.SaveChanges();
    }

    public void Delete(int id) {
        var technic = _dbContext.Technics.Find(id);
        if (technic != null) {
            _dbContext.Technics.Remove(technic);
            _dbContext.SaveChanges();
        }
    }

    public int GetCount() {
        return _dbContext.Technics.Count();
    }
    public List<Technic> GetAll() {
        return _dbContext.Technics.ToList();
    }

    public Technic GetById(int id) {
        return _dbContext.Technics.Find(id);
    }

    public void Create(Technic technic) {
        _dbContext.Technics.Add(technic);
        _dbContext.SaveChanges();
    }

    public void CreateComputer(Computer computer)
    {
        Console.WriteLine($"CreateComputer: {computer.Name}, {computer.ModelProcessor}");

        computer.Id = 0;
        _dbContext.Computers.Add(computer);
        _dbContext.SaveChanges();

        Console.WriteLine($"Created with ID: {computer.Id}");
    }

    public void CreateSmartfon(Smartfon smartfon)
    {
        Console.WriteLine($"CreateSmartfon: {smartfon.Name}, {smartfon.Manufactures}");

        smartfon.Id = 0;

        _dbContext.Smartfons.Add(smartfon);
        _dbContext.SaveChanges();

        Console.WriteLine($"Created with ID: {smartfon.Id}");
    }

    public List<object> GetComputersWithDetails()
    {
        return _dbContext.Computers
            .Select(c => new {
                c.Id,
                c.ModelProcessor,
                c.Ram,
                TechnicName = c.Name,      
                TechnicCountry = c.Country 
            })
            .ToList<object>();
    }

    public List<object> GetSmartfonList()
    {
        return _dbContext.Smartfons
            .Select(c => new {
                c.Id,
                c.CameraMP,
                c.Manufactures,
                TechnicName = c.Name,      
                TechnicCountry = c.Country
            })
            .ToList<object>();
    }

    public List<Technic> GetByRawSql(string country) {
        return _dbContext.Technics
            .FromSqlRaw("SELECT * FROM Technic WHERE country = {0}", country)
            .ToList();
    }
}