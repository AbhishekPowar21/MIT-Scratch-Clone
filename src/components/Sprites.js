import React from "react";
import Icon from "./Icon";
import { spritesAtom, activeSpriteAtom } from "../../util/atoms";
import { useAtom } from "jotai";

function Sprites() {
  const [sprites, setSprites] = useAtom(spritesAtom);
  const [activeSprite, setActiveSprite] = useAtom(activeSpriteAtom);

  const handleUpload = (event) => {
    let file = event.target.files[0];
    if (!file) return;

    let data = {
      icon: URL.createObjectURL(file),
      x: 0,
      y: 0,
      angle: 0,
      actions: [],
    };
    setSprites([...sprites, data]);
  };

  const handleManage = (event) => {
    event.preventDefault();
    const elementId = event.currentTarget.id.split("-")[1];
    setActiveSprite(Number(elementId));
  };

  const handleDelete = (event) => {
    const confirmed = window.confirm("Are you sure you want to delete this sprite?");
    if (!confirmed) return;

    let parent = event.currentTarget.parentNode;
    let id = parent.id.split("-")[1];
    setSprites(sprites.filter((_, idx) => idx !== parseInt(id)));

    // Select a new random sprite or set to null
    const getRandomIdx = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    setActiveSprite(sprites.length > 0 ? getRandomIdx(0, sprites.length - 1) : null);

    event.stopPropagation();
  };

  return (
    <>
      <div className="flex flex-col gap-4 mt-4">
        {sprites.map((item, idx) => (
          <div
            key={idx}
            id={`sprite-${idx}`}
            onClick={handleManage}
            className={`relative flex flex-col gap-2 rounded-lg shadow-lg p-4 items-center justify-center ${activeSprite === idx ? "border-2 border-green-600" : ""} hover:bg-gray-100 transition duration-200 ease-in-out`}
          >
            
            <img src={item.icon} alt={`Sprite ${idx}`} className="w-24 h-28 object-cover" />
            
          </div>
        ))}

        
      </div>
    </>
  );
}

export default Sprites;
