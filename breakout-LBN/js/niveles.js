// Definición de los 10 niveles del juego
const niveles = [
    // Nivel 1: Básico, solo ladrillos normales
    {
        filas: 4,
        columnas: 8,
        tipoLadrillo: 'normal',
        nombre: 'Normal',
        velocidadInicial: 4,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    
    // Nivel 2: Ladrillos indestructibles en posiciones fijas
    {
        filas: 5,
        columnas: 8,
        tipoLadrillo: 'indestructible',
        nombre: 'Indestructible',
        velocidadInicial: 4.5,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 1, 1, 2, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    
    // Nivel 3: Con ladrillos explosivos
    {
        filas: 5,
        columnas: 8,
        tipoLadrillo: 'explosivo',
        nombre: 'Explosivo',
        velocidadInicial: 5,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 3, 1, 1, 3, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    
    // Nivel 4: Ladrillos regenerativos
    {
        filas: 5,
        columnas: 10,
        tipoLadrillo: 'regenerativo',
        nombre: 'Regenerativo',
        velocidadInicial: 5.5,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 4, 1, 1, 4, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 4, 1, 1, 1, 1, 4, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    
    // Nivel 5: Ladrillos móviles
    {
        filas: 5,
        columnas: 10,
        tipoLadrillo: 'movil',
        nombre: 'Móvil',
        velocidadInicial: 6,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 5, 5, 5, 5, 5, 5, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    
    // Nivel 6: Patrón mixto con indestructibles
    {
        filas: 6,
        columnas: 10,
        tipoLadrillo: 'indestructible',
        nombre: 'Indestructible',
        velocidadInicial: 6.5,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 1, 1, 2, 2, 1, 1, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 2, 1, 1, 1, 1, 2, 1, 1],
            [1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    
    // Nivel 7: Patrón mixto con explosivos
    {
        filas: 6,
        columnas: 10,
        tipoLadrillo: 'explosivo',
        nombre: 'Explosivo',
        velocidadInicial: 7,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 3, 1, 3, 1, 1, 3, 1, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 3, 1, 1, 3, 3, 1, 1, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    
    // Nivel 8: Patrón complejo con regenerativos
    {
        filas: 7,
        columnas: 10,
        tipoLadrillo: 'regenerativo',
        nombre: 'Regenerativo',
        velocidadInicial: 7.5,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 4, 4, 4, 4, 4, 4, 1, 1],
            [1, 1, 4, 1, 1, 1, 1, 4, 1, 1],
            [1, 1, 4, 1, 1, 1, 1, 4, 1, 1],
            [1, 1, 4, 4, 4, 4, 4, 4, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    
    // Nivel 9: Patrón complejo con móviles
    {
        filas: 7,
        columnas: 12,
        tipoLadrillo: 'movil',
        nombre: 'Móvil',
        velocidadInicial: 8,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 5, 1, 1, 5, 5, 1, 1, 5, 1, 1],
            [1, 5, 1, 1, 5, 1, 1, 5, 1, 1, 5, 1],
            [1, 1, 5, 1, 1, 5, 5, 1, 1, 5, 1, 1],
            [1, 1, 1, 5, 1, 1, 1, 1, 5, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    },
    
    // Nivel 10: Final - Mezcla compleja con todos los tipos
    {
        filas: 8,
        columnas: 12,
        tipoLadrillo: 'todos',
        nombre: 'Especial',
        velocidadInicial: 8.5,
        disposicion: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1],
            [1, 1, 4, 1, 1, 4, 4, 1, 1, 4, 1, 1],
            [1, 1, 1, 3, 1, 1, 1, 1, 3, 1, 1, 1],
            [1, 5, 1, 1, 5, 1, 1, 5, 1, 1, 5, 1],
            [1, 1, 3, 1, 1, 3, 3, 1, 1, 3, 1, 1],
            [1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ]
    }
];

// Constantes para tipos de ladrillos
const LADRILLO_NORMAL = 1;
const LADRILLO_INDESTRUCTIBLE = 2;
const LADRILLO_EXPLOSIVO = 3;
const LADRILLO_REGENERATIVO = 4;
const LADRILLO_MOVIL = 5;

// Estado de los niveles (completados, actual, máximo desbloqueado)
const estadoNiveles = {
    nivelesCompletados: Array(10).fill(false), // Inicialmente ningún nivel completado
    nivelActual: 1,
    nivelMaximoDesbloqueado: 10 // Modificado para desbloquear todos los niveles
}; 