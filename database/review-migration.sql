-- Database migration for reviews system
-- Create review table for CSE 340 inventory management system
CREATE TABLE IF NOT EXISTS public.review (
    review_id SERIAL PRIMARY KEY,
    inv_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    review_rating INTEGER NOT NULL CHECK (
        review_rating >= 1
        AND review_rating <= 5
    ),
    review_text TEXT NOT NULL,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    review_approved BOOLEAN DEFAULT FALSE,
    -- Foreign key constraints
    CONSTRAINT fk_review_inv FOREIGN KEY (inv_id) REFERENCES public.inventory(inv_id) ON DELETE CASCADE,
    CONSTRAINT fk_review_account FOREIGN KEY (account_id) REFERENCES public.account(account_id) ON DELETE CASCADE,
    -- Unique constraint to prevent duplicate reviews per user per vehicle
    CONSTRAINT uq_review_user_vehicle UNIQUE(inv_id, account_id)
);
-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_review_inv_id ON public.review(inv_id);
CREATE INDEX IF NOT EXISTS idx_review_account_id ON public.review(account_id);
CREATE INDEX IF NOT EXISTS idx_review_approved ON public.review(review_approved);
CREATE INDEX IF NOT EXISTS idx_review_date ON public.review(review_date DESC);