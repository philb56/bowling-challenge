// console.log("start");
// console.log(frame._score)
// console.log(frame._ballsRemaining)
// console.log(frame._bonusBalls)
// console.log("end");
describe("Frame", function() {
  var frame;

  beforeEach(function() {
    frame = new Frame();
    lastFrame = new Frame(true);
  });

  it("should be able to indicate whether it's not yet complete", function() {
    expect(frame.isComplete()).toEqual(false);
  });

  it("should be able count how many balls are left", function() {
    expect(frame.ballsRemaining()).toEqual(2);
  });

  it("should decrement how many balls are left when a ball is played", function() {
    frame.play();
    expect(frame.ballsRemaining()).toEqual(1);
  });

  it("should be complete after two games if not last game", function() {
    frame.play();
    frame.play();
    expect(frame.isComplete()).toEqual(true);
  });

  it("should be able to set a frame as the last one", function() {
    expect(lastFrame.lastFrame()).toEqual(true);
  });


  it("should set bonus balls to two if a strike - X", function() {
    frame.play("X");
    expect(frame.bonusBalls()).toEqual(2);
    expect(frame.score()).toEqual(10);
    expect(frame.isComplete()).toEqual(true);
  });

  it("should set bonus balls to two if a strike - 10", function() {
    frame.play(10);
    expect(frame.bonusBalls()).toEqual(2);
    expect(frame.score()).toEqual(10);
    expect(frame.isComplete()).toEqual(true);
  });

  it("should set bonus balls to one if a spare - /", function() {
    frame.play("-");
    frame.play("/");
    expect(frame.bonusBalls()).toEqual(1);
    expect(frame.score()).toEqual(10);
    expect(frame.isComplete()).toEqual(true);
  });

  it("should set bonus balls to one if a spare - 10", function() {
    frame.play("-");
    frame.play(10);
    expect(frame.bonusBalls()).toEqual(1);
    expect(frame.score()).toEqual(10);
    expect(frame.isComplete()).toEqual(true);
  });

  it("should set bonus balls to one if a spare 3 & 7", function() {
    frame.play(3);
    frame.play(7);
    expect(frame.bonusBalls()).toEqual(1);
    expect(frame.score()).toEqual(10);
    expect(frame.isComplete()).toEqual(true);
  });

  it("shouldn't set bonus balls if not a strike or spare 3&6", function() {
    frame.play(3);
    frame.play(6);
    expect(frame.bonusBalls()).toEqual(0);
    expect(frame.score()).toEqual(9);
    expect(frame.isComplete()).toEqual(true);
  });


  it("should set balls remaining to two on last frame if a strike", function() {
    lastFrame.play(10);
    expect(lastFrame.ballsRemaining()).toEqual(2);
  });

  it("should set balls remaining to one on last frame if a spare", function() {
    lastFrame.play(3);
    lastFrame.play(7);
    expect(lastFrame.ballsRemaining()).toEqual(1);
  });

  describe("Last frame not a strike or spare", function() {

    beforeEach(function() {
      lastFrame = new Frame(true);
      lastFrame.play(3);
      lastFrame.play(6);
    });

    it("shouldn't set bonus balls on the last frame if not a strike or spare", function() {
      expect(lastFrame.bonusBalls()).toEqual(0);
    });

    it("shouldn't set balls remaining on the last frame if not a strike or spare", function() {
      expect(lastFrame.ballsRemaining()).toEqual(0);
    });

    it("should set score to 9 on last frame with 3 & 6 pins", function() {
      expect(lastFrame.score()).toEqual(9);
    });

    it("should set frame complete after two balls on last frame if score <10", function() {
      expect(lastFrame.isComplete()).toEqual(true);
    });

  });
  describe("Ensure correct pins added for each ball", function() {

    beforeEach(function() {
      frame = new Frame();
    });

    it("should set ball1 to X after strike", function() {
      frame.play("X");
      expect(frame._ball1).toEqual("X");
    });
    it("should set ball1 to - after first play", function() {
      frame.play("-");
      expect(frame._ball1).toEqual("-");
    });
    it("should set ball1 to 7 after first play", function() {
      frame.play(7);
      expect(frame._ball1).toEqual(7);
    });
    it("should set ball2 to / after spare", function() {
      frame.play("-");
      frame.play("/");
      expect(frame._ball2).toEqual("/");
    });
    it("should set ball2 to 7 after spare 3&7", function() {
      frame.play(3);
      frame.play(7);
      expect(frame._ball2).toEqual(7);
    });
    it("should set ball2 to 6 after second play", function() {
      frame.play(3);
      frame.play(6);
      expect(frame._ball2).toEqual(6);
    });
  });

  describe("Validation - game complete", function() {

    it("should not allow three balls", function() {
      frame = new Frame();
      frame.play("-");
      frame.play("-");
      expect(function() {frame.play(10);}).toThrow(new Error('This game is complete'));
    });

    it("shouldn\'t allow three balls on last frame unless strike or spare", function() {
      lastFrame = new Frame(true);
      lastFrame.play("-");
      lastFrame.play("-");
      expect(function() {lastFrame.play(10);}).toThrow(new Error('This game is complete'));
    });

    it("should allow three balls on last frame if a strike", function() {
      lastFrame = new Frame(true);
      lastFrame.play("X");
      lastFrame.play("-");
      expect(function() {lastFrame.play(0);}).not.toThrow(new Error('This game is complete'));
    });

    it("should allow three balls on last frame if a spare", function() {
      lastFrame = new Frame(true);
      lastFrame.play("3");
      lastFrame.play("7");
      expect(function() {lastFrame.play("X");}).not.toThrow(new Error('This game is complete'));
    });

    it("should allow three strikes on last frame", function() {
      lastFrame = new Frame(true);
      lastFrame.play("X");
      lastFrame.play("X");
      expect(function() {lastFrame.play("X");}).not.toThrow(new Error('This game is complete'));
    });
  });

  describe("Validation - score values", function() {

    beforeEach(function() {
      frame = new Frame();
    });

    it("should not allow scores over 10", function() {
      frame.play(1)
      expect(function() {frame.play(10);}).toThrow(new Error('Score for this game should not exceed 10'));
    });
  });

  describe("Validation - score values", function() {

      beforeEach(function() {
        frame = new Frame();
      });

      it("should not allow 11", function() {
        expect(function() {frame.play(11);}).toThrow(new Error('Invalid score: 11'));
      });
    it("should not allow *", function() {;
      expect(function() {frame.play("*");}).toThrow(new Error('Invalid score: *'));
    });
    it("should allow -", function() {
      expect(function() {frame.play("-");}).not.toThrow(new Error('Invalid score: -'));
    });
    it("should allow /", function() {
      expect(function() {frame.play("/");}).not.toThrow();;
    });
    it("should allow X", function() {
      expect(function() {frame.play("X");}).not.toThrow();;
    });
    it("should allow 0 - 10 ", function() {
      for (i = 0; i < 11; i++) {
        expect(function() {frame.play(i);}).not.toThrow(new Error('Invalid score: ' + i));;
      }
    });

  });

});
