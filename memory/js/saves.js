var json2 = localStorage.getItem("saves") || '{"first_nom":"","first_punts":0,"second_nom":"","second_punts":0,"third_nom":"","third_punts":0}';
records_data = JSON.parse(json2);

document.getElementById("firstName").innerHTML = "Jugador/a: " + records_data[0].nom + " Puntuació: " + Math.trunc(records_data[0].punts);
document.getElementById("secondName").innerHTML = "Jugador/a: " + records_data[1].nom + " Puntuació: " + Math.trunc(records_data[1].punts);
document.getElementById("thirdName").innerHTML = "Jugador/a: " + records_data[2].nom + " Puntuació: " + Math.trunc(records_data[2].punts);