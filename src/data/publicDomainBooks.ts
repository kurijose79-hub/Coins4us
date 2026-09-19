export interface PublicDomainBook {
  id: string;
  title: string;
  author: string;
  series?: string;
  language: string;
  source: string;
  text: string;
}

export const PUBLIC_DOMAIN_BOOKS: PublicDomainBook[] = [
  {
    id: "pd-quijote-cap1",
    title: "Don Quijote de la Mancha (extracto, cap. 1)",
    author: "Miguel de Cervantes",
    series: "Don Quijote de la Mancha",
    language: "es",
    source: "Dominio público (publicado en 1605)",
    text: `En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.

El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera.

Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza. Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosímiles se deja entender que se llamaba Quejana.`,
  },
  {
    id: "pd-alice-cap1",
    title: "Alice's Adventures in Wonderland (excerpt, ch. 1)",
    author: "Lewis Carroll",
    series: "Alice's Adventures in Wonderland",
    language: "en",
    source: "Public domain (published 1865)",
    text: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice, "without pictures or conversations?"

So she was considering in her own mind, (as well as she could, for the hot day made her feel very sleepy and stupid,) whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.

There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, "Oh dear! Oh dear! I shall be late!" but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet.`,
  },
  {
    id: "pd-becquer-rimas",
    title: "Rimas (extracto)",
    author: "Gustavo Adolfo Bécquer",
    language: "es",
    source: "Dominio público (publicado en 1871)",
    text: `Rima XXI. ¿Qué es poesía?, dices mientras clavas en mi pupila tu pupila azul. ¿Qué es poesía? ¿Y tú me lo preguntas? Poesía... eres tú.

Rima IV. No digáis que agotado su tesoro, de asuntos falta, enmudeció la lira; podrá no haber poetas; pero siempre habrá poesía.

Mientras la ciencia a descubrir no alcance las fuentes de la vida, y en el mar o en el cielo haya un abismo que al cálculo resista, mientras la humanidad siempre avanzando no sepa a dó camina, mientras haya un misterio para el hombre, ¡habrá poesía!`,
  },
];
