import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceCompletionComponent } from './sentence-completion.component';

describe('SentenceCompletionComponent', () => {
  let component: SentenceCompletionComponent;
  let fixture: ComponentFixture<SentenceCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentenceCompletionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentenceCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
