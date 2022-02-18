import { valuePossibilities } from '../@types/avaliationPossibleValues'

export default function meaningOfTheAvaliation(numberAsString: string) {
    const index = parseInt(numberAsString) as valuePossibilities
    const meaning = numericMeanings[index]

    return meaning
}

const numericMeanings = {
    142: "great",
    183: "good",
    182: "regular",
    143: "bad"
}
