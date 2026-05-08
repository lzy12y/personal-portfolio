Personal Portfolio Development Spec: Time Tunnel & Time Metaphor Edition
1. Core Design Philosophy
Visual Theme: A 3D "Time Tunnel" based on one-point perspective.

Metaphor: The central vanishing point represents the "source of inspiration/the future," while elements flying outward represent "past works/the accumulation of time."

Atmosphere: Minimalist, dark, profound, and cinematic with high contrast—emphasizing spatial storytelling.

2. Technical Stack
Framework: Next.js (App Router)

Animation: Framer Motion (Essential for scroll-driven Z-axis displacement and physics-based effects)

Styling: Tailwind CSS

Rendering: Prioritize CSS 3D Transforms to maintain a raw, high-end web aesthetic.

3. Visual System
Color Palette:

Background: Deep Black #050505.

Vanishing Point: A white center point with a 50px radius blur glow (Bloom Effect) at the horizon.

Guidelines: 1px wide ultra-long lines (mimicking the reference image), color: Dark Gray #222222, shifting with scroll velocity.

Perspective Settings:

Parent Container: perspective: 400px (To intensify depth and create visual compression).

Vanishing Point Origin: perspective-origin: center center.

Layout Planes:

Top Plane: Video branch.

Bottom Plane: Ideas/Thoughts branch.

Left Plane: Photography branch.

Right Plane: Design/Architecture branch.

4. Interaction Mechanics
A. Scroll-Driven Z-Axis
Driver: Listen to page scroll progress using useScroll.

Mapping: Map the scroll progress to the translateZ coordinates of all components.

Layering: Distribute projects along the Z-axis with varying intervals.

Distal (Near Center): opacity: 0, scale: 0.1.

Proximal (Flying Toward User): opacity fades in to 1, scale increases.

B. Motion Blur & Velocity
Physics: Calculate scroll velocity using useVelocity.

Visual Feedback:

High Velocity: Apply filter: blur(10px) and scaleY(1.2) (vertical stretch) to components to simulate "time travel."

Static/Slow: Smoothly transition back to sharp focus.

C. Focus & Click Interaction
Hit-Zone Logic: Trigger a "Focus" state when a project's translateZ enters a specific "near-field" range (e.g., [-100px, 0px]).

Focus Feedback:

The component's 3D rotation (rotateX/Y) resets to zero, facing the user directly.

Display a bold white title (e.g., PROJECT 2026).

Navigation: Clicking a focused project triggers a full-screen expansion animation, where the background tunnel "explodes" outward.

5. UI Details & Ornamentation
Custom Cursor: A 10px white ring with a center pixel-dot, providing scale feedback on hover.

Metadata: Minimal 8pt fonts in the corners displaying dynamic info:

Creative Year: A virtual timestamp that changes based on scroll depth.

Real-time Coordinates: Mouse X/Y pixel values.