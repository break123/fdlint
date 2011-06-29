module XRay

  class Node

    attr_reader :text, :position

    def initialize(text = '', position = nil)
      @text, @position = text, position
    end

    def to_s
      text
    end
  end

end