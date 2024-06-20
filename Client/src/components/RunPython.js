export default async function runPythonScript() {
  let pyodide = await loadPyodide();
  console.log(
    pyodide.runPython(`
      import sys
      sys.version
  `)
  );
  pyodide.runPython("print(1 + 2)");
}
