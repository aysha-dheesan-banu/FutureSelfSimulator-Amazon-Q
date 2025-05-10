import { useState } from "react";
import { Check } from "lucide-react";

// Avatar data URLs
const avatars = [
  {
    id: "male-1",
    url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiM0RjQ2RTUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM0RjQ2RTUiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4="
  },
  {
    id: "male-2",
    url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiMxMEI5ODEiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiMxMEI5ODEiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4="
  },
  {
    id: "male-3",
    url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiNGNTlFMEIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNGNTlFMEIiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4="
  },
  {
    id: "female-1",
    url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNFQzQ4OTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4="
  },
  {
    id: "female-2",
    url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiM4QjVDRjYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM4QjVDRjYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4="
  },
  {
    id: "female-3",
    url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiMwNkI2RDQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiMwNkI2RDQiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4="
  },
  {
    id: "neutral-1",
    url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiM2QjcyODAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM2QjcyODAiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4="
  },
  {
    id: "neutral-2",
    url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMjUiIGZpbGw9IiMwRUE1RTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiMwRUE1RTkiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM1IiByPSIyMCIgZmlsbD0iI0Y5RkFGQiIvPjxjaXJjbGUgY3g9IjQyIiBjeT0iMzIiIHI9IjQiIGZpbGw9IiMxRjI5MzciLz48Y2lyY2xlIGN4PSI1OCIgY3k9IjMyIiByPSI0IiBmaWxsPSIjMUYyOTM3Ii8+PHBhdGggZD0iTTQwIDQ1IFE1MCA1NSA2MCA0NSIgc3Ryb2tlPSIjMUYyOTM3IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4="
  }
];

interface AvatarSelectorProps {
  selected: string;
  onSelect: (avatar: string) => void;
}

export function AvatarSelector({ selected, onSelect }: AvatarSelectorProps) {
  return (
    <div className="mt-2">
      <div className="text-sm font-medium text-gray-700 mb-2">Choose your avatar</div>
      <div className="grid grid-cols-4 gap-3">
        {avatars.map((avatar) => (
          <div
            key={avatar.id}
            className={`relative cursor-pointer rounded-full overflow-hidden border-2 ${
              selected === avatar.url ? "border-blue-500" : "border-transparent"
            } hover:border-blue-300 transition-all`}
            onClick={() => onSelect(avatar.url)}
          >
            <img
              src={avatar.url}
              alt={`Avatar ${avatar.id}`}
              className="h-16 w-16 rounded-full object-cover"
            />
            {selected === avatar.url && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                <Check className="h-6 w-6 text-blue-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}