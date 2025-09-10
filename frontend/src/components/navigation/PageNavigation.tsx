import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

interface PageNavigationProps {
  showBack?: boolean;
  showNext?: boolean;
  backLabel?: string;
  nextLabel?: string;
  backPath?: string;
  nextPath?: string;
  onBack?: () => void;
  onNext?: () => void;
}

const PageNavigation: React.FC<PageNavigationProps> = ({
  showBack = true,
  showNext = false,
  backLabel = 'Back',
  nextLabel = 'Next',
  backPath,
  nextPath,
  onBack,
  onNext,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (nextPath) {
      navigate(nextPath);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
      {showBack ? (
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex items-center gap-2 bg-white shadow-lg hover:shadow-xl transition-all pointer-events-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Button>
      ) : (
        <div />
      )}

      {showNext && (
        <Button
          onClick={handleNext}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all pointer-events-auto"
        >
          {nextLabel}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default PageNavigation;