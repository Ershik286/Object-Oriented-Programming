using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

class Program {
    static void Main() {
        try {
            var parser = new CSharpClassAnalyzer();
            string projectPath = @"C:\Users\ersho\OneDrive\Документы\GitHub\Object-Oriented-Programming\Lab2\OOP_lab2\OOP_lab2";

            // Анализируем только конкретные папки
            var foldersToAnalyze = new[]
            {
                projectPath,
                Path.Combine(projectPath, "Class"),
                Path.Combine(projectPath, "WebAPI"),
                Path.Combine(projectPath, "WebAPI/Controllers"),
                Path.Combine(projectPath, "Data"),
                Path.Combine(projectPath, "Services")
            };

            var csFiles = new List<string>();
            foreach (var folder in foldersToAnalyze) {
                if (Directory.Exists(folder)) {
                    csFiles.AddRange(Directory.GetFiles(folder, "*.cs", SearchOption.TopDirectoryOnly));
                }
            }

            Console.WriteLine($"Найдено {csFiles.Count} C# файлов\n");

            string path = "test.txt";
            var text = new System.Text.StringBuilder();

            int processedFiles = 0;
            int errorFiles = 0;

            foreach (var file in csFiles) {
                try {
                    Console.WriteLine($"Обработка файла: {Path.GetFileName(file)}");

                    var classes = parser.ParseFile(file);

                    if (classes != null && classes.Any()) {
                        Console.WriteLine($"Файл: {Path.GetFileName(file)}");
                        foreach (var cls in classes) {
                            Console.WriteLine($"  {cls}");
                            text.AppendLine(cls.ToString());

                            if (cls.Constructors != null) {
                                foreach (var ctor in cls.Constructors) {
                                    Console.WriteLine($"    Конструктор: {ctor}");
                                    text.AppendLine("\\solutionheading{");
                                    text.AppendLine($"Конструктор : {ctor.ToString()}}}");
                                    text.AppendLine("\\begin{enumerate}");

                                    if (ctor.Parameters != null) {
                                        foreach (var parametr in ctor.Parameters) {
                                            Console.WriteLine("       " + parametr.ToString());
                                            text.AppendLine($"       \\item {parametr.ToString()}");
                                        }
                                    }

                                    text.AppendLine("\\end{enumerate}");
                                }

                                foreach (var methods in cls.metods) {
                                    Console.WriteLine($"    Метод: {methods}");
                                    if (methods.Parameters != null) {
                                        foreach (var parametr in methods.Parameters) {
                                            Console.WriteLine("       " + parametr.ToString());
                                            text.AppendLine($"       \\item {parametr.ToString()}");
                                        }
                                    }
                                }
                            }
                        }
                        Console.WriteLine();
                        processedFiles++;
                    }
                    else {
                        Console.WriteLine($"Файл {Path.GetFileName(file)} не содержит классов или вернул null\n");
                    }
                }
                catch (Exception ex) {
                    errorFiles++;
                    Console.WriteLine($"ОШИБКА при обработке файла {Path.GetFileName(file)}:");
                    Console.WriteLine($"  {ex.Message}");
                    Console.WriteLine($"  {ex.StackTrace}");
                    Console.WriteLine();

                    text.AppendLine($"% Ошибка при обработке файла {Path.GetFileName(file)}: {ex.Message}");
                }
            }

            File.WriteAllText(path, text.ToString());
            Console.WriteLine($"\nОбработано файлов: {processedFiles}, с ошибками: {errorFiles}");
            Console.WriteLine($"Результат сохранен в {path}");
        }
        catch (Exception ex) {
            Console.WriteLine($"Критическая ошибка в Main: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
        }

        Console.WriteLine("\nНажмите любую клавишу для выхода...");
        Console.ReadKey();
    }
}