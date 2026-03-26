using Microsoft.EntityFrameworkCore;
using OOP_lab2.Class;

public class AppDbContext : DbContext {
    public DbSet<Technic> Technics { get; set; }
    public DbSet<Computer> Computers { get; set; }
    public DbSet<Smartfon> Smartfons { get; set; }

    public const string connectionString = "Host=localhost;Port=5432;Database=Technics;Username=Ershik286;Password=CyberBiba227";

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {
    }

    public AppDbContext() {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        if (!optionsBuilder.IsConfigured) {
            optionsBuilder.UseNpgsql(connectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder) {
        modelBuilder.Entity<Technic>(entity => {
            entity.ToTable("Technics");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.Country).IsRequired();
        });

        modelBuilder.Entity<Computer>(entity => {
            entity.ToTable("Computers");

            entity.HasBaseType<Technic>();

            entity.Property(e => e.ModelProcessor).IsRequired();
            entity.Property(e => e.Ram).IsRequired();

            entity.HasOne(e => e.Technic)
                .WithOne()
                .HasForeignKey<Computer>(e => e.Id);
        });

        modelBuilder.Entity<Smartfon>(entity => {
            entity.ToTable("Smartfons");

            entity.HasBaseType<Technic>();

            entity.Property(e => e.CameraMP).IsRequired();
            entity.Property(e => e.Manufactures).IsRequired();

            entity.HasOne(e => e.Technic)
                .WithOne()
                .HasForeignKey<Smartfon>(e => e.Id);
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

    public void CreateWithComputer(Technic technic, Computer computer) {
        computer.Technic = technic;
        _dbContext.Technics.Add(technic);
        _dbContext.Computers.Add(computer);
        _dbContext.SaveChanges();
    }

    public List<object> GetComputersWithDetails() {
        return _dbContext.Computers
            .Include(c => c.Technic)
            .Select(c => new {
                c.Id,
                c.ModelProcessor,
                c.Ram,
                TechnicName = c.Technic.Name,
                TechnicCountry = c.Technic.Country
            })
            .ToList<object>();
    }

    public List<object> GetSmartfonList() {
        return _dbContext.Smartfons
                    .Include(c => c.Technic)
                    .Select(c => new {
                        c.Id,
                        c.CameraMP,
                        c.Manufactures,
                        TechnicName = c.Technic.Name,
                        TechnicCountry = c.Technic.Country
                    })
                    .ToList<object>();
    }

    public List<Technic> GetByRawSql(string country) {
        return _dbContext.Technics
            .FromSqlRaw("SELECT * FROM Technic WHERE country = {0}", country)
            .ToList();
    }
}