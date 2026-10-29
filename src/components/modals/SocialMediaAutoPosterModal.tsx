import React from 'react';
import { InterCityTripListing, PassengerRideRequest, SocialCampaignType, TransportOffice } from '../../types/travel';
import { SocialMediaAutomator } from '../SocialMediaAutomator';

interface SocialMediaAutoPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialListing?: InterCityTripListing | null;
  initialPassengerRequest?: PassengerRideRequest | null;
  initialOffice?: TransportOffice | null;
  initialCampaignType?: SocialCampaignType;
}

export const SocialMediaAutoPosterModal: React.FC<SocialMediaAutoPosterModalProps> = ({
  isOpen,
  onClose,
  initialListing,
  initialPassengerRequest,
  initialOffice,
  initialCampaignType = 'passenger_campaign_carousel'
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="max-w-5xl w-full max-h-[94vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <SocialMediaAutomator
          initialListing={initialListing}
          initialPassengerRequest={initialPassengerRequest}
          initialOffice={initialOffice}
          initialCampaignType={initialCampaignType}
          onClose={onClose}
          isModalMode={true}
        />
      </div>
    </div>
  );
};

