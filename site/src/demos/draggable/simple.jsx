<XWrapper>
  <div style={{ display: "flex", justifyContent: "space-evenly" }}>
    <DraggableBox ref={box1Ref}>Box1</DraggableBox>
    <DraggableBox ref={box2Ref}>Box2</DraggableBox>
    <XArrow start={box1Ref} end={box2Ref}>
      <XLine />
    </XArrow>
  </div>
</XWrapper>;
