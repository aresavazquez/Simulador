//
//  DetailViewController.h
//  simulador
//
//  Created by ares on 02/10/15.
//  Copyright (c) 2015 ares. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface DetailViewController : UIViewController

@property (strong, nonatomic) id detailItem;
@property (weak, nonatomic) IBOutlet UILabel *detailDescriptionLabel;

@end

