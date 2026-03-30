using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

public class CSharpClassAnalyzer {
    public CSharpClassAnalyzer() {

    }

    public CSharpClassAnalyzer(int id, string name) {

    }

    public List<ClassInfo> ParseFile(string filePath) {
        try {
            var code = File.ReadAllText(filePath);
            var tree = CSharpSyntaxTree.ParseText(code);
            var root = tree.GetCompilationUnitRoot();

            var classes = new List<ClassInfo>();

            // Находим все объявления классов
            var classDeclarations = root.DescendantNodes()
                .OfType<ClassDeclarationSyntax>();

            foreach (var classDecl in classDeclarations) {
                var classInfo = new ClassInfo {
                    Name = classDecl.Identifier.Text,
                    Namespace = GetNamespace(classDecl),
                    Modifiers = classDecl.Modifiers.Select(m => m.Text).ToList() ?? new List<string>(),
                    Constructors = GetConstructors(classDecl),
                    metods = GetMethods(classDecl)  // ВАЖНО: инициализируем metods
                };

                classes.Add(classInfo);
            }

            return classes;
        }
        catch (Exception ex) {
            Console.WriteLine($"Ошибка при парсинге файла {filePath}: {ex.Message}");
            return new List<ClassInfo>();
        }
    }

    private string GetNamespace(ClassDeclarationSyntax classDecl) {
        try {
            // Поднимаемся по дереву до объявления namespace
            var namespaceDecl = classDecl.Ancestors()
                .OfType<NamespaceDeclarationSyntax>()
                .FirstOrDefault();

            var fileScopedNamespace = classDecl.Ancestors()
                .OfType<FileScopedNamespaceDeclarationSyntax>()
                .FirstOrDefault();

            if (namespaceDecl != null)
                return namespaceDecl.Name.ToString();
            else if (fileScopedNamespace != null)
                return fileScopedNamespace.Name.ToString();
        }
        catch { }

        return string.Empty;
    }

    private List<ConstructorInfo> GetConstructors(ClassDeclarationSyntax classDecl) {
        var constructors = new List<ConstructorInfo>();

        try {
            foreach (var ctor in classDecl.Members.OfType<ConstructorDeclarationSyntax>()) {
                var ctorInfo = new ConstructorInfo {
                    Name = ctor.Identifier.Text,
                    Parameters = GetParameters(ctor.ParameterList),
                    Modifiers = ctor.Modifiers.Select(m => m.Text).ToList() ?? new List<string>(),
                    Body = ctor.Body?.ToString() ?? ctor.ExpressionBody?.ToString() ?? string.Empty
                };

                constructors.Add(ctorInfo);
            }
        }
        catch (Exception ex) {
            Console.WriteLine($"Ошибка при получении конструкторов: {ex.Message}");
        }

        return constructors;
    }

    private List<ParameterInfo> GetParameters(ParameterListSyntax parameterList) {
        var parameters = new List<ParameterInfo>();

        try {
            if (parameterList == null)
                return parameters;

            foreach (var param in parameterList.Parameters) {
                var paramInfo = new ParameterInfo {
                    Name = param.Identifier.Text,
                    Type = param.Type?.ToString() ?? "var",
                    Modifiers = param.Modifiers.Select(m => m.Text).ToList() ?? new List<string>(),
                    DefaultValue = param.Default?.Value?.ToString() ?? string.Empty
                };

                parameters.Add(paramInfo);
            }
        }
        catch (Exception ex) {
            Console.WriteLine($"Ошибка при получении параметров: {ex.Message}");
        }

        return parameters;
    }

    private List<FunctionInfo> GetMethods(ClassDeclarationSyntax classDecl) {
        var methods = new List<FunctionInfo>();

        if (classDecl?.Members == null)
            return methods;

        foreach (var method in classDecl.Members.OfType<MethodDeclarationSyntax>()) {
            try {
                var methodInfo = new FunctionInfo {
                    Name = method.Identifier.Text,
                    Parameters = GetParameters(method.ParameterList),
                    Modifiers = method.Modifiers.Select(m => m.Text).ToList() ?? new List<string>(),
                    Body = GetMethodBody(method),
                    ReturnType = method.ReturnType?.ToString() ?? "void"  // Добавляем ReturnType
                };

                methods.Add(methodInfo);
            }
            catch (Exception ex) {
                Console.WriteLine($"Error processing method {method.Identifier.Text}: {ex.Message}");
                continue;
            }
        }

        return methods;
    }

    private string GetMethodBody(MethodDeclarationSyntax method) {
        try {
            if (method.Body != null) {
                var body = method.Body.ToString();
                // Ограничиваем размер тела метода
                return body.Length > 1000 ? body.Substring(0, 1000) + "..." : body;
            }

            if (method.ExpressionBody != null) {
                var body = method.ExpressionBody.ToString();
                return body.Length > 1000 ? body.Substring(0, 1000) + "..." : body;
            }

            return string.Empty;
        }
        catch {
            return string.Empty;
        }
    }
}

public class ClassInfo {
    public string Name { get; set; } = string.Empty;
    public string Namespace { get; set; } = string.Empty;
    public List<string> Modifiers { get; set; } = new List<string>();
    public List<ConstructorInfo> Constructors { get; set; } = new List<ConstructorInfo>();
    public List<FunctionInfo> metods { get; set; } = new List<FunctionInfo>();  // Инициализируем здесь

    public override string ToString() {
        try {
            string modifiers = "класс";
            if (Modifiers != null && Modifiers.Any()) {
                modifiers = Modifiers.Contains("public") ? "Публичный класс" :
                           Modifiers.Contains("private") ? "Приватный класс" :
                           Modifiers.Contains("abstract") ? "Абстрактный класс" :
                           Modifiers.Contains("static") ? "Статический класс" : "Класс";
            }

            int constructorsCount = Constructors?.Count ?? 0;
            int methodsCount = metods?.Count ?? 0;

            return $"{modifiers} {Name} (Конструкторы: {constructorsCount}, Методы: {methodsCount})";
        }
        catch (Exception ex) {
            return $"Class: {Name ?? "Unknown"} (Error in ToString: {ex.Message})";
        }
    }
}

public class ConstructorInfo {
    public string Name { get; set; } = string.Empty;
    public List<ParameterInfo> Parameters { get; set; } = new List<ParameterInfo>();
    public List<string> Modifiers { get; set; } = new List<string>();
    public string Body { get; set; } = string.Empty;

    public override string ToString() {
        try {
            var modifiers = Modifiers != null && Modifiers.Any() ? string.Join(" ", Modifiers) + " " : "";
            var parameters = Parameters != null && Parameters.Any()
                ? string.Join(", ", Parameters.Select(p => $"{p.Type} {p.Name}"))
                : "";
            string water = !Parameters.Any() ? " - конструктор по умолчанию" : "";
            return $"{modifiers}{Name}({parameters}){water}";
        }
        catch {
            return $"Constructor: {Name ?? "Unknown"}";
        }
    }
}

public class FunctionInfo {
    public string Name { get; set; } = string.Empty;
    public string ReturnType { get; set; } = "void";  // Добавляем ReturnType
    public List<ParameterInfo> Parameters { get; set; } = new List<ParameterInfo>();
    public List<string> Modifiers { get; set; } = new List<string>();
    public string Body { get; set; } = string.Empty;

    public override string ToString() {
        try {
            var modifiers = Modifiers != null && Modifiers.Any() ? string.Join(" ", Modifiers) + " " : "";
            var parameters = Parameters != null && Parameters.Any()
                ? string.Join(", ", Parameters.Select(p => $"{p.Type} {p.Name}"))
                : "";
            string returnType = ReturnType ?? "void";
            return $"{modifiers}{returnType} {Name}({parameters})";
        }
        catch {
            return $"Method: {Name ?? "Unknown"}";
        }
    }
}

public class ParameterInfo {
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public List<string> Modifiers { get; set; } = new List<string>();
    public string DefaultValue { get; set; } = string.Empty;

    public override string ToString() {
        try {
            var parts = new List<string>();

            // Добавляем модификаторы (ref, out, in, params)
            if (Modifiers != null && Modifiers.Any()) {
                parts.Add(string.Join(" ", Modifiers));
            }

            // Добавляем тип
            parts.Add(Type ?? "var");

            // Добавляем имя параметра
            parts.Add(Name ?? "unknown");

            string water = "";
            if (Type == "int" || Type == "float" || Type == "double" || Type == "decimal") {
                water = " (числовое значение)";
            }
            else if (Type == "string" || Type == "char") {
                water = " (строковое значение)";
            }
            else if (!string.IsNullOrEmpty(Type)) {
                water = " (объект)";
            }

            // Собираем основную часть
            var result = string.Join(" ", parts) + water;

            // Добавляем значение по умолчанию, если есть
            if (!string.IsNullOrEmpty(DefaultValue)) {
                result += $" = {DefaultValue}";
            }

            return result;
        }
        catch {
            return $"Parameter: {Name ?? "unknown"} : {Type ?? "unknown"}";
        }
    }
}