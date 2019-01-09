import ConfigurationFactory from './infrastructure//Configuration/ConfigationFactory'
import TrelloBoardManager from './infrastructure/BoardManager/TrelloBoardManager'

const test = async () => {
  const trelloBoardManager = new TrelloBoardManager(ConfigurationFactory.create())
  const cardId = await trelloBoardManager.createCard('test-card', 'test-val', '5bab6a391071c087cc9b4e45');
  trelloBoardManager.moveCard(cardId, '5bab6a405397ba3e982505ae')
  trelloBoardManager.addLabel(cardId, 'Проверка корпоративности')
  trelloBoardManager.addLabel(cardId, 'test label')
  trelloBoardManager.setDueDate(cardId, new Date())

  const card = await trelloBoardManager.getCard(cardId)

  console.log(card)

  console.log(await trelloBoardManager.getBoardLists(card.idBoard))
  console.log(await trelloBoardManager.getBoardMembers(card.idBoard))

  await trelloBoardManager.addMemberToCard(cardId, '515d38633e3501ae50002899')
} 

test()
