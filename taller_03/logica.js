var inputNum1 = document.getElementById("num1");
var inputNum2 = document.getElementById("num2");
var contenedor = document.getElementById("resultados");
var boton = document.getElementById("btnCalcular");

function calcular() {
  var num1 = parseFloat(inputNum1.value);
  var num2 = parseFloat(inputNum2.value);

  contenedor.innerHTML = "";

  if (isNaN(num1) || isNaN(num2)) {
    contenedor.textContent = "Introduce dos números válidos.";
    return;
  }

  for (var i = 1; i <= 5; i++) {
    var resultado;
    var operacion;

    switch (i) {
      case 1:
        operacion = "Suma";
        resultado = num1 + num2;
        break;
      case 2:
        operacion = "Resta";
        resultado = num1 - num2;
        break;
      case 3:
        operacion = "Multiplicación";
        resultado = num1 * num2;
        break;
      case 4:
        operacion = "División";
        resultado = num2 === 0 ? "No se puede dividir entre 0" : num1 / num2;
        break;
      case 5:
        operacion = "Módulo";
        resultado = num2 === 0 ? "No se puede dividir entre 0" : num1 % num2;
        break;
    }

    var p = document.createElement("p");
    p.textContent = operacion + ": " + resultado;
    contenedor.appendChild(p);
  }
}

boton.addEventListener("click", calcular);