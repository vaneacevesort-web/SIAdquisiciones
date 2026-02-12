'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipodocumentos', [
      { valor: 'curp', valor_real: 'Ser mexicano en pleno goce y ejercicio de sus derechos políticos y civiles.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'constancia_residencia', valor_real: 'Tener residencia efectiva en el territorio del Estado de México no menor de cinco años anteriores al día de su elección.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'titulo_licenciatura', valor_real: 'Tener preferentemente título de licenciado en derecho, así como experiencia o estudios en materia de derechos humanos.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'acta_nacimiento', valor_real: 'Tener treinta y cinco años cumplidos, el día de su elección.', createdAt: new Date(), updatedAt: new Date() },    
      { valor: 'carta_ant_no_penales', valor_real: 'Gozar de buena fama pública y no haber sido condenado mediante sentencia ejecutoriada, por delito intencional.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta1', valor_real: 'No ser ministro de culto, excepto que se haya separado de su ministerio con tres años de anticipación al día de su elección.', createdAt: new Date(), updatedAt: new Date() },     
      { valor: 'carta_protesta2', valor_real: 'No haber desempeñado cargo directivo en algún partido, asociación u organización política, en los tres años anteriores al día de su elección.', createdAt: new Date(), updatedAt: new Date() },   
      { valor: 'carta_protesta3', valor_real: 'No haber sido sancionado en el desempeño de empleo, cargo o comisión en el servicio público federal, estatal o municipal, con motivo de alguna recomendación emitida por organismos públicos de derechos humanos.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_protesta4', valor_real: 'No haber sido objeto de sanción de inhabilitación o destitución administrativas para el desempeño de empleo, cargo o comisión en el servicio público, mediante resolución que haya causado estado.', createdAt: new Date(), updatedAt: new Date() },      
      { valor: 'carta_protesta5', valor_real: 'Carta firmada de manera autógrafa en donde manifieste su voluntad expresa de participar en el proceso de selección, así como su aceptación y conformidad con las bases, procedimientos y deliberaciones del proceso.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'curriculum', valor_real: 'Curriculum Vitae firmado autógrafamente por la persona aspirante, en el que se señale su experiencia laboral, formación académica; especialización en derechos humanos; experiencia profesional en el ámbito de la protección, observancia, promoción, estudio y divulgación de los derechos humanos; y, en su caso, publicaciones en materias relacionadas con los derechos humanos.',  createdAt: new Date(), updatedAt: new Date() },
      { valor: 'propuesta_programa', valor_real: 'Documento impreso con la propuesta de programa de trabajo con una extensión máxima de diez cuartillas, con letra tipo Arial, tamaño número 12 e interlineado 1.5.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'copia_certificada', valor_real: 'Copia certificada de los documentos con los que acredite su título(s) o grado(s) académico(s);', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'ine', valor_real: 'Credencial para votar con fotografía vigente, expedida por el Instituto Nacional Electoral en copia legible, de preferencia ampliada al 200% y en original para su cotejo.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'informe_no_penales', valor_real: 'Informe de no antecedentes penales, expedido por la Fiscalía General de Justicia del Estado de México, con fecha de expedición no mayor a treinta días anteriores a la fecha de su presentación.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'carta_motivos', valor_real: 'Carta de exposición de motivos firmada por la persona aspirante y descripción de las razones que justifican su idoneidad, con una extensión no mayor a tres cuartillas.', createdAt: new Date(), updatedAt: new Date() },
      { valor: 'escrito_consentimiento', valor_real: 'Escrito de consentimiento para el tratamiento de datos personales, así como Aviso de Privacidad relativo al tratamiento de los datos personales descritos en la presente Convocatoria. Ambos documentos deberán descargarse de página https://legislacion.congresoedomex.gob.mx/avisosdeprivacidad y deberán ser entregados debidamente firmados por la o el aspirante.', createdAt: new Date(), updatedAt: new Date() },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipodocumentos', null, {});
  }
};
