const fs = require('fs');

class Contenedor {
  /** @typedef {{id: number, [key: string]: string}} CustomObject */

  filename = '';

  /** @param {string} filename */
  constructor(filename) {
    this.filename = filename ?? 'data.json'
    fs.writeFileSync(this.filename, '[]')
  }

  /** Guarda un objeto y devuelve su ID
   * @param {CustomObject} object
   * @returns {Promise<number>}
   */
  async save(object) {
    const objects = await this.getAll();

    const id = (objects[objects.length - 1]?.id ?? 0) + 1

    const objectToSave = { id, ...object };
    const objectsToSave = JSON.stringify([ ...objects, objectToSave ])

    try {
      await fs.promises.writeFile(this.filename, objectsToSave)
      return id;
    } catch (error) {
      throw new Error(error);
    }

  }

  /** Devuelve un elemento en base a un ID
   * @param {number} id
   * @returns {Promise<CustomObject>} 
   */
  async getById(id) {
    const objects = await this.getAll()
    return objects.find(object => object.id === id);
  }
  
  /** Retrona todos los elementos
   * @returns {Promise<CustomObject[]>}
   */
  async getAll() {
    try {
      const objects = await fs.promises.readFile(this.filename)
      return JSON.parse(objects)
    } catch (error) {
      throw new Error(error);
    }
  }
  
  /** Borra un elemento en base a su id
   * @param {number} id
   */
  async deleteById(id) {
    const objects = await this.getAll();
    const newObjectsArray = objects.filter(object => object.id !== id)

    try {
      await fs.promises.writeFile(this.filename, JSON.stringify(newObjectsArray))
    } catch (error) {
      throw new Error(error);
    }

  }
  
  /** Borra todos los elementos */
  async deleteAll() {
    try {
      await fs.promises.writeFile(this.filename, '[]')
    } catch (error) {
      throw new Error(error);
    }
  }
}

(async () => {
  const contenedor = new Contenedor('data.json')

  const equipo1 = await contenedor.save({ name: 'Boca', stadium: 'La Bombonera' })
  console.log(`Se ha agregado al equipo ${equipo1.name}`)

  const equipo2 = await contenedor.save({ name: 'River', stadium: 'Monumental' })
  console.log(`Se ha agregado al equipo ${equipo2}`)

  const equipo3 = await contenedor.save({ name: 'Racing', stadium: 'El Cilindro' })
  console.log(`Se ha agregado al equipo ${equipo3}`)

  console.log(await contenedor.getAll())
  console.log(await contenedor.getById(3))

  await contenedor.deleteById(2)
  console.log(await contenedor.getAll())

  await contenedor.deleteAll()
  console.log(await contenedor.getAll())
})()