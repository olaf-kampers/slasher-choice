export type Choice = { text: string; to: string };

export type StoryNode = {
  id: string;
  title: string;
  text: string;
  choices: Choice[];
};

export type Story = {
  startId: string;
  nodes: Record<string, StoryNode>;
};