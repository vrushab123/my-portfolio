import Avatar from './Avatar';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { cn } from '@/lib/utils';

export default function AskTarsButton({
  currentLink,
}: {
  currentLink: string;
}) {
  const clientRouter = useRouter();

  const deleteChatSession = async () => {
    const sessionId = localStorage.getItem('session-id-tars') || '';
    const res = await fetch(`/api/deleteTarsSession?sessionId=${sessionId}`);
    return res.status === 200;
  };

  const handleClearTarsHistory = async () => {
    ReactGA.event({
      category: 'Button.Click',
      action: 'Delete Tars Session Button',
    });
    localStorage.setItem('tars-history', '[]');

    // Dispatch custom event for TARS page to listen to BEFORE the API call
    if (currentLink === 'tars') {
      window.dispatchEvent(new CustomEvent('clearTarsHistory'));
    } else {
      clientRouter.reload();
    }

    // Try to delete the chat session, but don't let it block the UI update
    try {
      await deleteChatSession();
    } catch (error) {
      console.error('Error in deleteChatSession:', error);
    }
  };

  if (currentLink === 'tars') {
    return (
      <TooltipProvider>
        <div className="hidden md:flex flex-col items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                id="clear-tars-history-button"
                data-cursor="true"
                onClick={handleClearTarsHistory}
                variant="outline"
                size="icon"
                className={cn(
                  'w-10 h-10 rounded-full border-border bg-background',
                  'opacity-60 hover:opacity-100 transition-all duration-300',
                  'text-foreground hover:text-white'
                )}
              >
                <div
                  data-cursor="clear-tars-history-button"
                  className="w-6 h-6 flex items-center justify-center"
                  style={{
                    maskImage: `url(/images/delete.svg)`,
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: 'contain',
                    backgroundColor: 'currentColor',
                  }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Clear Tars History</p>
            </TooltipContent>
          </Tooltip>
          <Badge
            variant="outline"
            className="mt-2 text-sm border-0 bg-transparent"
          >
            Clear
          </Badge>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="ask-tars-button"
              data-cursor="true"
              onClick={() => {
                ReactGA.event({
                  category: 'Button.Click',
                  action: 'Ask Tars Page Button',
                });
                window.open(
                  'https://nova-27.vercel.app',
                  '_blank',
                  'noopener,noreferrer'
                );
              }}
              variant="outline"
              size="icon"
              className={cn(
                'w-10 h-10 rounded-full border border-border bg-background hover:border-primary',
                'group transition-colors duration-300',
                'shadow-xs text-foreground hover:text-white'
              )}
            >
              <div
                data-cursor="ask-tars-button"
                className="w-full h-full flex items-center justify-center"
                style={{
                  maskImage: `url(/images/tars.svg)`,
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  maskSize: 'contain',
                  backgroundColor: 'currentColor',
                }}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Ask NOVA about Vrushab</p>
          </TooltipContent>
        </Tooltip>
        <Badge
          variant="secondary"
          className={cn(
            'mt-2 text-sm font-light border-0 bg-transparent text-foreground',
            'group-hover:underline transition-all duration-300'
          )}
        >
          NOVA AI
        </Badge>
      </div>
    </TooltipProvider>
  );
}
