import { keysFromObject } from "./utils"


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
    }
}
// Validar que todos reciban un regalo solamente
const regalados = [...mapRegalados.values()]
for (const miembro of miembros) {
    if (!regalados.includes(miembro)) {
        console.error(`Error: ${miembro} no recibio regalo!`)
    }
}
if (miembros.length !== regalados.length) {
    console.error('Error: Algun miembro recibio mas de un regalo!')
}

// Validar que todos den un regalo solamente
const regaladores = [...mapRegalados.keys()]
for (const miembro of miembros) {
    if (!regaladores.includes(miembro)) {
        console.error(`Error: ${miembro} no dio regalo!`)
    }
}
if (miembros.length !== regaladores.length) {
    console.error('Error: Algun miembro dio mas de un regalo!')
}

console.log('Asignacion de regalos:')
for (const [miembro, regalado] of mapRegalados) {
    console.log(`${miembro} le regala a ${regalado}`)
}
