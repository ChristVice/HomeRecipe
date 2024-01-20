import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Card = ({ id, text, moveCard }) => {
  const [, drag] = useDrag({
    type: "CARD",
    item: { id },
  });

  return (
    <div ref={drag} className="card">
      {text}
    </div>
  );
};

const Folder = ({ cards, moveCard }) => {
  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item, monitor) => {
      moveCard(item.id, monitor.getItem().id);
    },
  });

  return (
    <div ref={drop} className="folder">
      {cards.map((card) => (
        <Card key={card.id} {...card} moveCard={moveCard} />
      ))}
    </div>
  );
};

const DND = () => {
  const cards = [
    { id: 1, text: "Card 1" },
    { id: 2, text: "Card 2" },
    { id: 3, text: "Card 3" },
  ];

  const moveCard = (draggedId, targetId) => {
    // Implement logic to reorder cards
    console.log(`Move card ${draggedId} to ${targetId}`);
  };

  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <Folder cards={cards} moveCard={moveCard} />
      </DndProvider>
    </div>
  );
};

export default DND;
