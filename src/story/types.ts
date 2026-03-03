export type Choice = { text: string; to: string };

export type StoryNode = {
  id: string;
  title: string;
  text: string;
  choices: Choice[];
  background?: string;
  sprite?: string;
  spritePosition?: "left" | "center" | "right";
};

export type Story = {
  startId: string;
  nodes: Record<string, StoryNode>;
};