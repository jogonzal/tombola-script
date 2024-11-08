import { keysFromObject } from "./utils"
import fs from 'fs'

const familias = {
    'tita': ['Tita', 'Paco'],
    'Marcelo papa': ['Marcelo papa', 'Cecy', 'Marcelito', 'Marifer', 'Karla'],
    'Jorge papa': ['Jorge papa', 'Jorgito', 'Laura', 'Mauri', 'Andres', 'Cristi'],
}

console.log('Empezando la tombola! 🎉. Estas son las familias:')

const miembros: string[] = []
const miembroAFamilia = new Map<string, string>()

for (const familia of keysFromObject(familias)) {
    const familiaMembers = familias[familia]
    console.log(`Familia ${familia}: ${JSON.stringify(familiaMembers, null, 2)}`)

    // Guardamos los miembros de la familia - estos maps hacen que sea facil buscar la familia de un miembro
    for (const miembro of familiaMembers) {
        miembros.push(miembro)
        miembroAFamilia.set(miembro, familia)
    }
}

console.log('Ejecutando tombola... 🎅')

// Map final de asignamiento de regalos
const mapRegalados = new Map<string, string>();

// Shuffle
miembros.sort(() => Math.random() - 0.5)
const miembrosPorRegalar = [...miembros]

// Asignamos los regalos, asegurandonos que no asignemos a ningun miembro a su misma familia
for (const miembro of miembros) {
    // Ciclar hasta encontrar un regalado que no sea de la misma familia
    console.log('Buscando regalado para', miembro)
    let posibleRegalado = miembrosPorRegalar[Math.floor(Math.random() * miembrosPorRegalar.length)]
    while (miembroAFamilia.get(miembro) === miembroAFamilia.get(posibleRegalado)) {
        console.log('Regalado', posibleRegalado, 'es de la misma familia que', miembro, 'buscando otro...')
        posibleRegalado = miembrosPorRegalar[Math.floor(Math.random() * miembrosPorRegalar.length)]
    }

    console.log('Regalado encontrado para ', miembro, posibleRegalado)

    // Eliminar al regalado de la lista de miembros por regalar
    miembrosPorRegalar.splice(miembrosPorRegalar.indexOf(posibleRegalado), 1)
    mapRegalados.set(miembro, posibleRegalado)
}

// Validacion...
// Validar que no se haya asignado a nadie de su misma familia
for (const [miembro, regalado] of mapRegalados) {
    if (miembroAFamilia.get(miembro) === miembroAFamilia.get(regalado)) {
        console.error(`Error: ${miembro} le regala a ${regalado}, pero son de la misma familia!`)
        throw new Error('Error en la tombola')
    }
}
// Validar que todos reciban un regalo solamente
const totalRegalos = new Map<string, number>();
const totalRegalados = new Map<string, number>();
for (const miembro of miembros) {
    const regalado = mapRegalados.get(miembro);
    if (!regalado) {
        console.error(`Error: ${miembro} no dio regalo!`)
        throw new Error('Error en la tombola')
    }
    totalRegalos.set(miembro, (totalRegalos.get(miembro) ?? 0) + 1);
    totalRegalados.set(regalado, (totalRegalados.get(regalado) ?? 0) + 1);
}
// Validar que todos reciban 1 y den 1
for (const miembro of miembros) {
    const totalRegalo = totalRegalos.get(miembro) ?? 0;
    if (totalRegalo != 1) {
        console.error(`${miembro} no da exactamente un regalo (${totalRegalo})`)
        throw new Error('Error en la tombola')
    }

    const totalRegalado = totalRegalados.get(miembro) ?? 0;
    if (totalRegalado != 1) {
        console.error(`${miembro} no recibe exactamente un regalo (${totalRegalados})`)
        throw new Error('Error en la tombola')
    }
}

console.log('Tombola ejecutada con exito! 🎅')

console.log('Asignacion de regalos:')
for (const [miembro, regalado] of mapRegalados) {
    console.log(`${miembro} le regala a ${regalado}`)
}

// Generate CSV with results
const csvData = []
for (const [miembro, regalado] of mapRegalados) {
    csvData.push({ miembro, regalado, mensaje: `Feliz Navidad ${miembro}! Para el intercambio prepara un regalo para ${regalado}`})
}
const csvString = `de,para,mensaje\n` + csvData.map(row => `${row.miembro},${row.regalado}, ${row.mensaje}`).join('\n')
fs.writeFileSync('tombola.csv', csvString)
console.log('Archivo CSV generado con exito! 🎅')