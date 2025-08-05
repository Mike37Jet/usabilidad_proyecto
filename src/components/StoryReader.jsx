import React, { useState } from 'react';
import './StoryReader.css';

const StoryReader = () => {
  const stories = [
    {
      id: 1,
      title: "The Enchanted Forest",
      content: `Once upon a time, deep in an ancient forest, there lived a young girl named Lily. Lily was known for her curiosity and love of adventure. One day, while exploring the forest, she discovered a hidden path that glowed with an ethereal blue light.

      As she followed the path, the trees around her grew taller and more twisted, their branches reaching towards the sky like gnarled fingers. Strange flowers bloomed along the way, releasing sparkling pollen into the air.

      Eventually, Lily reached a clearing where an enormous, ancient oak tree stood. At its base sat an elderly woman with silver hair that seemed to float around her.

      "I've been waiting for you, Lily," the woman said with a gentle smile.

      "How do you know my name?" Lily asked, astonished.

      "The forest speaks to me, child. And now, it wishes to speak to you too."

      From that day forward, Lily became the forest's guardian, learning its secrets and protecting its magic from those who would harm it.`
    },
    {
      id: 2,
      title: "The Forgotten Lighthouse",
      content: `The old lighthouse stood on the edge of the cliff, abandoned for decades but still standing strong against the relentless sea. Marcus had heard stories about it his entire life—tales of strange lights and phantom keepers that his grandfather used to tell.

      Now, as a marine biologist studying the coastal ecosystem, Marcus finally had a reason to visit the legendary structure. What was meant to be a simple research expedition turned into something else when he found the door to the lighthouse unlocked.

      Inside, everything was preserved as if the keeper had just stepped out moments ago. A logbook lay open on the desk, its final entry dated fifty years earlier: "Something in the deep. It's calling to me."

      That night, as Marcus slept in the old keeper's quarters, he was awakened by a gentle blue glow emanating from the sea. Looking out the window, he saw countless luminous shapes moving beneath the waves, creating patterns that seemed almost like writing.

      By morning, Marcus found himself writing in the old logbook, continuing where the last keeper had left off.`
    },
    {
      id: 3,
      title: "The Time Collector",
      content: `Professor Eleanor Reed had devoted her life to studying time—not as a physicist or philosopher, but as what she called a "time archaeologist." She collected moments: preserved seconds sealed in small glass vials that she kept meticulously labeled in her laboratory.

      Her colleagues thought her eccentric at best, delusional at worst. Until the day she demonstrated her most significant discovery.

      "Time isn't linear," she explained to the gathered scientists. "It's more like fabric—it can be folded, cut, and even patched together."

      She opened a vial labeled "July 16, 1945, 5:29 AM, Alamogordo, New Mexico." The room suddenly filled with a blinding light and a distant rumble—the exact moment of the first atomic bomb test, contained in her small laboratory.

      As the demonstration ended and the stunned scientists regained their composure, Eleanor smiled. "This is just the beginning. Imagine being able to revisit any moment in history, not just to observe, but to understand it completely."

      What she didn't tell them was that she had already begun experimenting with altering the contents of her vials, changing small moments in time and observing how the ripples spread outward, rewriting reality itself.`
    }
  ];

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const nextStory = () => {
    setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const prevStory = () => {
    setCurrentStoryIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
  };

  const selectStory = (index) => {
    setCurrentStoryIndex(index);
  };

  return (
    <div className="story-reader-container">
      <h1 className="story-reader-title">Story Collection</h1>
      
      <div className="story-navigation">
        <button onClick={prevStory} className="nav-button">Previous Story</button>
        <div className="story-indicators">
          {stories.map((story, index) => (
            <span 
              key={story.id}
              className={`story-indicator ${index === currentStoryIndex ? 'active' : ''}`}
              onClick={() => selectStory(index)}
            />
          ))}
        </div>
        <button onClick={nextStory} className="nav-button">Next Story</button>
      </div>
      
      <div className="story-content">
        <h2>{stories[currentStoryIndex].title}</h2>
        <div className="story-text">
          {stories[currentStoryIndex].content.split('\n\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph.trim()}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryReader;
