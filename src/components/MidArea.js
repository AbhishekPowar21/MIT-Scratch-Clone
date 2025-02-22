import React from "react";
import Icon from "./Icon";
import dragItems from "../../util/DragItems";
import { useAtom } from "jotai";
import { spritesAtom, activeSpriteAtom } from "../../util/atoms";

export default function MidArea() {
  const [sprites, setSprites] = useAtom(spritesAtom);
  const [activeSprite, setActiveSprite] = useAtom(activeSpriteAtom);

  const handleDrag = (e) => {
    let actionID = e.dataTransfer.getData("elementID");
    let value = e.dataTransfer.getData("value");

    let action = structuredClone(dragItems[parseInt(actionID) - 1]);

    if (actionID == 3) {
      value = JSON.parse(value);
      action.Xvalue = parseInt(value.x);
      action.Yvalue = parseInt(value.y);
    } else {
      action.value = parseInt(value);
    }

    setSprites((prevSprites) => {
      return prevSprites.map((item, idx) => {
        if (activeSprite === idx) {
          return {
            ...item,
            actions: [...item.actions, action], // Immutable update
          };
        }
        return item;
      });
    });
  };

  const handleDelete = (itemIdx) => {
    setSprites((prevSprites) => {
      return prevSprites.map((item, idx) => {
        if (activeSprite === idx) {
          return {
            ...item,
            actions: item.actions.filter((action, actionIndex) => actionIndex !== itemIdx),
          };
        }
        return item;
      });
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrag}
      onDragOver={handleDragOver}
      className="flex-1 pl-2 h-full overflow-auto"
    >
      {sprites.length >= 1 &&
        sprites[activeSprite].actions.map((item, idx) => (
          <div
            key={idx}
            className={`relative flex flex-col rounded ${item.color} text-black px-2 py-2 my-2 text-sm w-6/12 cursor-pointer`}
          >
            {/* Static Action text at the top */}
            <div className="font-semibold text-xs uppercase text-black mb-1">Action</div>

            {/* Action-specific text */}
            <div className="font-bold text-sm mb-1">{item.text}</div>

            {/* Action values */}
            <div className="flex items-center">
              {item.value ? item.value : `X: ${item.Xvalue}, Y: ${item.Yvalue}`}
              {item.suffix}
            </div>

            {/* Delete icon */}
            <div
              className="absolute top-2 right-1 text-white text-xs cursor-pointer hover:text-gray-300"
              onClick={() => handleDelete(idx)}
            >
              <Icon name="trash" size={15} />
            </div>
          </div>
        ))}
    </div>
  );
}
